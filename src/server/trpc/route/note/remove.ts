import {TRPCError} from "@trpc/server"

import {revalidate} from "server/lib/util/revalidate"
import {procedure} from "server/trpc/procedure/server"

import {RemoveOutput} from "server/trpc/type/output/RemoveOutput"
import {NoteRemoveInput} from "server/trpc/type/input/NoteRemoveInput"
import {NoteStatus} from "server/trpc/type/common/NoteStatus"

import {Note} from "server/db/entity/Note"

export const remove = procedure
  .input(NoteRemoveInput)
  .output(RemoveOutput)
  .mutation(async ({input, ctx}) => {
    const {id, soft} = input
    const {orm} = ctx

    const note = await orm.em.findOneOrFail(Note, input.id, {
      filters: false,

      failHandler: () => new TRPCError({code: "NOT_FOUND"})
    })

    if (soft) {
      note.status = NoteStatus.REJECTED
    } else {
      orm.em.remove(note)
    }

    await orm.em.flush()

    // Revalidate note's route for soft remove, because it's actually just an update
    if (soft) {
      revalidate(`/view/${note.id}`)
    }

    return {id, soft}
  })
