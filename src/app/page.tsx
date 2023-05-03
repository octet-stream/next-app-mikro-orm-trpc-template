import {NoteStatusFilter} from "server/trpc/type/common/NoteStatusFilter"

import type {AFC} from "lib/type/AsyncFunctionComponent"

import {getNotes} from "./_/loader/getNotes"

import {NotesView} from "./_/component/NotesView"
import {NotesTabs} from "./_/component/NotesTabs"

export const dynamic = "force-dynamic" // Make page dynamic

export interface SearchParams {
  page?: string
  status?: NoteStatusFilter
}

interface Props {
  searchParams: SearchParams
}

const NotesPage: AFC<Props> = async ({searchParams}) => {
  const notes = await getNotes(searchParams)

  return (
    <div className="w-full mobile:max-w-mobile mobile:mx-auto">
      <NotesTabs active={searchParams.status} />

      <NotesView notes={notes} />
    </div>
  )
}

export default NotesPage
