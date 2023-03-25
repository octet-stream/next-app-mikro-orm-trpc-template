import type {input, output} from "zod"
import {z} from "zod"

import {createPageInput} from "server/trpc/helper/createPageInput"
import {NoteStatusFilterSchema} from "server/trpc/type/common/NoteStatusFilter"

export const NotesPageInput = createPageInput({maxLimit: 500}, z.object({
  filter: z
    .object({status: NoteStatusFilterSchema.optional()})
    .optional()
    .default({})
}))

export type INotesPageInput = input<typeof NotesPageInput>

export type ONotesPageInput = output<typeof NotesPageInput>
