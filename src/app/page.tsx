import type {Metadata} from "next"

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

function getTitle(status?: NoteStatusFilter): string | undefined {
  switch (status) {
  case NoteStatusFilter.ACTIVE:
    return "Active"
  case NoteStatusFilter.COMPLETED:
    return "Completed"
  case NoteStatusFilter.REJECTED:
    return "Rejected"
  default:
    return undefined
  }
}

export async function generateMetadata({
  searchParams
}: Props): Promise<Metadata> {
  const title = getTitle(searchParams.status)

  if (!title) {
    return {}
  }

  return {
    title: {
      absolute: `${title} — Simple Notes`
    }
  }
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
