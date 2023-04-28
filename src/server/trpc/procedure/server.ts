import fetchContextCheck from "server/trpc/middleware/fetchContextCheck"

import {baseProcedure} from "./base"

/**
 * Procedure builder for server-side usage only.
 * Adds middleware with server-side context check.
 */
export const procedure = baseProcedure.use(fetchContextCheck)

export const ssrProcedure = procedure
