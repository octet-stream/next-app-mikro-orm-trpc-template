/* eslint-disable indent */

import {notFound} from "next/navigation"
import {TRPCError} from "@trpc/server"

import type {Caller} from "server/trpc/router"
import {router} from "server/trpc/router"

import type {MaybePromise} from "lib/type/MaybePromise"

interface CallerImplementation<TResult, TArgs extends readonly unknown[]> {
  (trpc: Caller, ...args: TArgs): MaybePromise<TResult>
}

/**
 * Calls `notFound()` if `TRPCError` with code `NOT_FOUND` occurred
 */
function maybeNotFoundError(error: unknown): never {
  if (error instanceof TRPCError && error.code === "NOT_FOUND") {
    notFound()
  }

  throw error
}

/**
 * Wraps a tRPC procedure caller with proper Next.js 13 error handling.
 *
 * Catches `NOT_FOUND` errors and shows 404 page.
 *
 * @param caller A function that executes tRPC query
 */
export function createCaller<TResult, TArgs extends readonly unknown[]>(
  caller: CallerImplementation<TResult, TArgs>
) {
  const trpc = router.createCaller({})

  return function decoratedCaller(...args: TArgs) {
    try {
      const result = caller(trpc, ...args)

      if (result instanceof Promise) {
        return result.catch(maybeNotFoundError)
      }

      return result
    } catch (error) {
      maybeNotFoundError(error)
    }
  }
}
