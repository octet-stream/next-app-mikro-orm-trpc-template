import anyTest from "ava"

import {RequestContext} from "@mikro-orm/core"
import type {ImplementationFn, TestFn} from "ava"
import type {MikroORM} from "@mikro-orm/core"

import {getORM} from "server/lib/db/orm"
import type {Caller} from "server/trpc/router"
import {router} from "server/trpc/router"

import {serverAddress} from "lib/util/serverAddress"

export interface WithTRPCContext { }

type Args = [trpc: Caller, orm: MikroORM]

type Implementation = ImplementationFn<Args, WithTRPCContext>

const test = anyTest as TestFn<WithTRPCContext>

/**
 * Creates a MikroORM RequestContet and runs implementation function within that context.
 * Also creates trpc caller for testing.
 *
 * The implementation will be called with three arguments: test context, trpc caller and orm
 */
export const withTRPC = test.macro(async (t, fn: Implementation) => {
  const orm = await getORM()

  const req = new Request(serverAddress)
  const resHeaders = new Headers()

  const caller = router.createCaller({req, resHeaders})

  return RequestContext.createAsync(orm.em, async () => fn(t, caller, orm))
})
