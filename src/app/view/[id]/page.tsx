import {router} from "server/trpc/router"

import type {AFC} from "lib/type/AsyncFunctionComponent"
import {createPageDataLoader} from "lib/util/createPageDataLoader"

import {TNotesPageOutput} from "server/trpc/type/output/NotesPageOutput"

import {NotesStateContextProvider} from "context/NotesStateContext"
import {NoteStateContextProvider} from "context/NoteStateContext"

import {NoteCreateModal} from "component/NoteModal"

import {NoteView} from "view/NoteView/NoteView"

export const revalidate = 0

interface Params {
  id: string
}

interface Props {
  params: Params
}

const getNote = createPageDataLoader((id: string) => {
  const trpc = router.createCaller({})

  return trpc.note.getById({id})
})

const NoteViewPage: AFC<Props> = async ({params}) => {
  const note = await getNote(params.id)

  // Probably just a bad design decision. This is just to use NoteCreateModal :)
  const fakeNotes: TNotesPageOutput = {
    pagesCount: 1,
    rowsCount: 0,
    itemsCount: 0,
    items: [],
    prevCursor: null,
    nextCursor: null,
    limit: null,
    maxLimit: null,
    current: 1
  }

  return (
    <NotesStateContextProvider data={fakeNotes}>
      <NoteStateContextProvider data={note}>
        <NoteView />
      </NoteStateContextProvider>

      <NoteCreateModal redirect />
    </NotesStateContextProvider>
  )
}

export default NoteViewPage
