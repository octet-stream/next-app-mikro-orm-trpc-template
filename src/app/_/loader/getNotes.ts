import {cache} from "react"

import {createCaller} from "lib/trpc/server"

import type {SearchParams} from "../../page"

export const getNotes = cache(createCaller(
  async (trpc, params: SearchParams = {}) => trpc.notes.list({
    cursor: params.page,
    filter: params.status ? {status: params.status} : undefined
  })
))
