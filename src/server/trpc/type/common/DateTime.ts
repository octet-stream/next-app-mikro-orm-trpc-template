import type {input, output} from "zod"
import {parseISO, toDate} from "date-fns"
import {z} from "zod"

import isString from "lodash/isString"

export const DateTime = z
  .union([z.date(), z.string(), z.number()])
  .transform<Date>(date => isString(date) ? parseISO(date) : toDate(date))
  .transform<string>(date => date.toISOString())

export type IDateTime = input<typeof DateTime>

export type ODateTime = output<typeof DateTime>
