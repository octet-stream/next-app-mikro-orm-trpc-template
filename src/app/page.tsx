import {NoteStatusFilter} from "server/trpc/type/common/NoteStatusFilter"

import type {AFC} from "lib/type/AsyncFunctionComponent"
import {createCaller} from "lib/trpc/server"

import {NotesView, NotesTabs} from "view/NotesView"

export const revalidate: number = 0 // Make page dynamic

interface SearchParams {
  page?: string
  status?: NoteStatusFilter
}

const getNotes = createCaller(
  async (trpc, params: SearchParams = {}) => trpc.notes.list({
    cursor: params.page ? Number(params.page) : undefined,
    filter: params.status ? {status: params.status} : undefined
  })
)

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
