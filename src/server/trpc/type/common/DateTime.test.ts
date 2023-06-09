import test from "ava"

import {parseISO} from "date-fns"

import {DateTime} from "./DateTime"

test("Validates Date object and returns the same date", async t => {
  const expected = new Date()
  const actual = parseISO(await DateTime.parseAsync(expected))

  t.true(actual instanceof Date)
  t.is(Number(actual), Number(expected))
})

test("Accepts iso string and returns date object", async t => {
  const expected = new Date().toISOString()
  const actual = parseISO(await DateTime.parseAsync(expected))

  t.true(actual instanceof Date)
  t.is(actual.toISOString(), expected)
})

test("Accepts a number and returns date object", async t => {
  const expected = Date.now()
  const actual = parseISO(await DateTime.parseAsync(expected))

  t.true(actual instanceof Date)
  t.is(Number(actual), expected)
})
