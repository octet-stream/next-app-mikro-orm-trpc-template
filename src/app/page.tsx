import type {AFC} from "lib/type/AsyncFunctionComponent"

import {createCaller} from "lib/trpc/server"

import {NotesTabs, NotesView} from "view/NotesView"

export const revalidate: number = 0

const getNotes = createCaller(async trpc => trpc.notes.list())

const NotesPage: AFC = async () => {
  const notes = await getNotes()

  return (
    <NotesTabs initialNotes={notes}>
      <NotesView />
    </NotesTabs>
  )
}

export default NotesPage
