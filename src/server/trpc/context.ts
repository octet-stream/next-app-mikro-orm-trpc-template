import type {CreateNextContextOptions} from "@trpc/server/adapters/next"
import type {NextApiRequest, NextApiResponse} from "next"

const calledWithCreateCallerKey = "__calledWithCreateCaller"

export type WithCreateCallerContext = {
  [calledWithCreateCallerKey]: true
}

export type Context = object | object & WithCreateCallerContext

export type SSRContext<R = any> = Context & {
  req: NextApiRequest
  res: NextApiResponse<R>
}

export type GlobalContext = Context | SSRContext

export function isSSRContext(
  ctx: GlobalContext
): ctx is SSRContext {
  return !!((ctx as SSRContext)?.req && (ctx as SSRContext)?.res)
}

export const isCreateCallerContext = <T extends GlobalContext>(
  ctx: T
): ctx is T & WithCreateCallerContext => calledWithCreateCallerKey in ctx

export const createContext = (
  ctx: CreateNextContextOptions
): GlobalContext => isSSRContext(ctx) ? ctx : {}
