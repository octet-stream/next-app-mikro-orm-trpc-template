import {cache} from "react"

import {createCaller} from "lib/trpc/server"

export const getNote = cache(createCaller(
  (trpc, id: string) => trpc.note.getById({id})
))
