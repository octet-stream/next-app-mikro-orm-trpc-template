/* eslint-disable @typescript-eslint/indent */
import type {ZodObject, input, output, ZodRawShape} from "zod"
import {z} from "zod"

import type {MaybeNull} from "lib/type/MaybeNull"

import {PageArgs} from "server/trpc/helper/PageArgs"

export interface CreatePageInputOptions {
  maxLimit?: MaybeNull<number>
}

const defaults: Required<CreatePageInputOptions> = {
  maxLimit: null
}

type PageOutput<T extends ZodRawShape = never> = [T] extends [never]
  ? {args: PageArgs}
  : {args: PageArgs} & output<ZodObject<T>>

/**
 * Creates PageInput type with given `maxLimit` option
 */
export function createPageInput<T extends {} = never>(
  options?: CreatePageInputOptions,
  extensions?: ZodObject<T>
) {
  const {maxLimit} = {...defaults, ...options}

  const Cursor = z
    .union([
      z.number().int().positive(),
      z.string().regex(/^[0-9]+$/)
    ])
    .optional()
    .transform(cursor => cursor == null ? undefined : Number(cursor))

  const LimitBase = z.number().int().positive()

  const Limit = maxLimit ? LimitBase.max(maxLimit).default(maxLimit) : LimitBase

  const PageBaseInput = z
    .object({cursor: Cursor, limit: Limit.optional()})
    .default(maxLimit ? {limit: maxLimit} : {})

  const PageInput = extensions
    ? z.intersection(extensions, PageBaseInput)
    : PageBaseInput

  return PageInput
    .optional()
    .transform(({cursor, limit, ...rest} = {}) => {
      const args = new PageArgs({cursor, limit, maxLimit})

      return {...rest, args} as PageOutput<T>
    })
}

/**
 * Page input type with max `limit` and its default value set to `50`
 */
export const DefaultPageInput = createPageInput({maxLimit: 50})

export type IDefaultPageInput = input<typeof DefaultPageInput>

export type ODefaultPageInput = output<typeof DefaultPageInput>
