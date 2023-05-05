import {TRPCError} from "@trpc/server"
import {wrap} from "@mikro-orm/core"

import {revalidate} from "server/lib/util/revalidate"
import {procedure} from "server/trpc/procedure/server"

import {NoteUpdateInput} from "server/trpc/type/input/NoteUpdateInput"
import {NoteOutput} from "server/trpc/type/output/NoteOutput"

import {Note} from "server/db/entity"

export const update = procedure
  .input(NoteUpdateInput)
  .output(NoteOutput)
  .mutation(async ({input, ctx}) => {
    const {id, ...fields} = input
    const {orm} = ctx

    const note = await orm.em.findOneOrFail(Note, id, {
      failHandler: () => new TRPCError({code: "NOT_FOUND"})
    })

    wrap(note).assign(fields)

    await orm.em.flush()

    revalidate("/")
    revalidate(`/view/${note.id}`)

    return note
  })
