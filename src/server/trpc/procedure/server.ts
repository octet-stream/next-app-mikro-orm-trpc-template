import {withSsrContextCheck} from "server/trpc/middleware/withSsrContextCheck"

import {baseProcedure} from "./base"

/**
 * Procedure builder for server-side usage only.
 * Adds middleware with server-side context check.
 */
export const procedure = baseProcedure.use(withSsrContextCheck)

export const ssrProcedure = procedure
