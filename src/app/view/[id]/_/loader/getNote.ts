import {createCaller} from "lib/trpc/server"

export const getNote = createCaller(
  (trpc, id: string) => trpc.note.getById({id})
)
