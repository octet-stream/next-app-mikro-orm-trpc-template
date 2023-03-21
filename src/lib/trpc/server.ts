/* eslint-disable indent */

import {notFound} from "next/navigation"
import {TRPCError} from "@trpc/server"

import type {Caller} from "server/trpc/router"
import {router} from "server/trpc/router"

interface CallerImplementation<TResult, TArgs extends readonly unknown[]> {
  (trpc: Caller, ...args: TArgs): TResult
}

interface DecoratedCaller<TResult, TArgs extends readonly unknown[]> {
  (...args: TArgs): TResult
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
): DecoratedCaller<TResult, TArgs> {
  const trpc = router.createCaller({})

  return function decoratedCaller(...args: TArgs): TResult {
    try {
      const result = caller(trpc, ...args)

      if (result instanceof Promise) {
        // @ts-expect-error Not sure how to fix this yet. This function meant to be typed as both sync and async depending on the `TResult`.
        return result.catch(maybeNotFoundError)
      }

      return result
    } catch (error) {
      maybeNotFoundError(error)
    }
  }
}
