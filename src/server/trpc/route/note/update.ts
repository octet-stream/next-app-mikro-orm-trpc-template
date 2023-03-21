import {TRPCError} from "@trpc/server"
import {wrap} from "@mikro-orm/core"

import {procedure} from "server/trpc/procedure/base"

import {withCache} from "server/trpc/middleware/withCache"
import {withSsrContextCheck} from "server/trpc/middleware/withSsrContextCheck"

import {NoteUpdateInput} from "server/trpc/type/input/NoteUpdateInput"
import {NoteOutput} from "server/trpc/type/output/NoteOutput"

import {Note} from "server/db/entity"

export const update = procedure
  .use(withCache)
  .use(withSsrContextCheck)
  .input(NoteUpdateInput)
  .output(NoteOutput)
  .mutation(async ({input, ctx}) => {
    const {id, ...fields} = input
    const {orm, cache} = ctx

    const note = await orm.em.findOneOrFail(Note, id, {
      failHandler: () => new TRPCError({code: "NOT_FOUND"})
    })

    wrap(note).assign(fields)

    await orm.em.flush()

    cache.revalidate(
      {
        path: "note.getById",
        rawInput: {
          id: note.id
        }
      },

      // Validation happens right after procedure returns a value
      await NoteOutput.parseAsync(note)
    )

    return note
  })
