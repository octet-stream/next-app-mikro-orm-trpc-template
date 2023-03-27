import type {Entries} from "type-fest"
import type {FC} from "react"

import {
  NoteStatusFilter,
  NoteStatusFilterNames
} from "server/trpc/type/common/NoteStatusFilter"

import {NoteTab} from "./NotesTab"

const filters = Object.entries(
  NoteStatusFilterNames
) as Entries<typeof NoteStatusFilterNames>

interface Props {
  active?: NoteStatusFilter
}

export const NotesTabs: FC<Props> = ({active = NoteStatusFilter.ALL}) => (
  <ul className="mb-5 w-full flex bg-black text-white dark:bg-slate-800 rounded-md">
    {filters.map(([status, name]) => (
      <li key={status}>
        <NoteTab name={name} status={status} active={active === status} />
      </li>
    ))}
  </ul>
)
