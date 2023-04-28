import type {
  FetchCreateContextFn,
  FetchCreateContextFnOptions
} from "@trpc/server/adapters/fetch"

import type {Router} from "./router"

export interface Context { }

export type FetchContext = Context & FetchCreateContextFnOptions

export type GlobalContext = Context | FetchContext

export const isFetchContext = (
  ctx: GlobalContext
): ctx is FetchContext => !!("req" in ctx && "resHeaders" in ctx)

export const createContext: FetchCreateContextFn<Router> = (
  ctx
): GlobalContext => isFetchContext(ctx) ? ctx : {}
