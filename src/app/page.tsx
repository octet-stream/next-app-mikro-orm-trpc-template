import {createPageDataLoader} from "lib/util/createPageDataLoader"
import type {AFC} from "lib/type/AsyncFunctionComponent"

import {router} from "server/trpc/router"

import {NotesTabs, NotesView} from "view/NotesView"

export const revalidate: number = 0

const getNotes = createPageDataLoader(async () => {
  const trpc = router.createCaller({})

  return trpc.notes.list()
})

const NotesPage: AFC = async () => {
  const notes = await getNotes()

  return (
    <NotesTabs initialNotes={notes}>
      <NotesView />
    </NotesTabs>
  )
}

export default NotesPage
