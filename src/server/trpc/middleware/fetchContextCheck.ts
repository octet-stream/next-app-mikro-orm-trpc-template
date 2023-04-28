import {TRPCError} from "@trpc/server"

import {isFetchContext} from "server/trpc/context"
import {middleware} from "server/trpc/def"

/**
 * Checks whether SSRContext is present. Throws an error if is not. Narrows GlobalContext to SSRContext type.
 */
const fetchContextCheck = middleware(({ctx, next}) => {
  if (!isFetchContext(ctx)) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "FetchContext required for this operation"
    })
  }

  return next({ctx})
})

export default fetchContextCheck
