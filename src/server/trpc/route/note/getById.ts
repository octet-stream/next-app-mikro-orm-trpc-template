import {TRPCError} from "@trpc/server"

import {procedure} from "server/trpc/procedure/base"

import {withCache} from "server/trpc/middleware/withCache"

import {Node} from "server/trpc/type/common/Node"
import {NoteOutput} from "server/trpc/type/output/NoteOutput"

import {Note} from "server/db/entity"

export const getById = procedure
  .use(withCache)
  .input(Node)
  .output(NoteOutput)
  .query(async ({input, ctx}) => {
    const {orm} = ctx

    return orm.em.findOneOrFail(Note, input.id, {
      filters: false,

      failHandler: () => new TRPCError({code: "NOT_FOUND"})
    })
  })
