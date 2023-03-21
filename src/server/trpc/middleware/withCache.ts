/* eslint-disable no-underscore-dangle */

import {isCreateCallerContext} from "server/trpc/context"
import {ProcedureCache} from "server/trpc/ProcedureCache"
import {middleware} from "server/trpc/def"

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

export const withCache = middleware(async ({
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
      return {ok: true, data: cached, marker: "middlewareMarker"}
    }
  }

  const result: any = await next({ctx: {...ctx, cache}})

  if (result.ok === true && enableCache) {
    cache.set({path, rawInput, meta}, result.data)
  }

  return result
})
