/* eslint-disable no-underscore-dangle */

import type {MiddlewareFunction, ProcedureParams} from "@trpc/server"

import type {GlobalContext} from "server/trpc/context"
import {isCreateCallerContext} from "server/trpc/context"
import {ProcedureCache} from "server/trpc/ProcedureCache"
import {trpc} from "server/trpc/def"

interface ContextWithCache {
  cache: ProcedureCache
}

interface GlobalWithProcedureCache {
  __TRPC_PROCEDURE_CACHE__: ProcedureCache
}

// eslint-disable-next-line no-undef
const globalObject = globalThis as typeof globalThis & GlobalWithProcedureCache

function getCache(): ProcedureCache {
  if (!globalObject.__TRPC_PROCEDURE_CACHE__) {
    globalObject.__TRPC_PROCEDURE_CACHE__ = new ProcedureCache()
  }

  return globalObject.__TRPC_PROCEDURE_CACHE__
}

type CacheMiddleware = MiddlewareFunction<
ProcedureParams<typeof trpc["_config"], GlobalContext>,
ProcedureParams<typeof trpc["_config"], GlobalContext & ContextWithCache>
>

export const withCache: CacheMiddleware = async ({
  ctx,
  next,
  path,
  rawInput,
  meta,
  type
}) => {
  // Cache only query procedures called with `createCaller` helper
  const enableCache = type === "query" && isCreateCallerContext(ctx)

  const cache = getCache()

  if (enableCache) {
    const cached = cache.get({path, rawInput, meta})
    if (cached) {
      // Not sure how safe this would be
      return {
        ok: true, data: cached, marker: "middlewareMarker"
      } as any
    }
  }

  const result = await next({ctx: {...ctx, cache}})

  if (result.ok === true && enableCache) {
    cache.set({path, rawInput, meta}, (result as any).data)
  }

  return result
}
