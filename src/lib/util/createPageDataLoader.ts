/* eslint-disable indent */

import {notFound} from "next/navigation"
import {TRPCError} from "@trpc/server"

import type {MaybePromise} from "lib/type/MaybePromise"

interface PageDataSource<TResult, TArgs extends unknown[]> {
  (...args: TArgs): MaybePromise<TResult>
}

/**
 * Wraps a tRPC query with proper Next.js 13 error handling.
 *
 * Catches `NOT_FOUND` errors and shows 404 page.
 *
 * @param source A function that executes tRPC query
 */
export const createPageDataLoader = <TResult, TArgs extends unknown[]>(
  source: PageDataSource<TResult, TArgs>
) => async (...args: TArgs): Promise<TResult> => {
  try {
    return await source(...args)
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") {
      notFound()
    }

    throw error
  }
}
