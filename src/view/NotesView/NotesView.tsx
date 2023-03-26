import type {FC} from "react"

import {ONotesPageOutput} from "server/trpc/type/output/NotesPageOutput"

import {NotesStateContextProvider} from "context/NotesStateContext"

import {NoteCreateModal} from "component/NoteModal/NoteCreateModal"

import {NotesEmpty} from "./NotesEmpty"
import {NotesList} from "./NotesList"

interface Props {
  notes: ONotesPageOutput
}

export const NotesView: FC<Props> = ({notes}) => (
  <NotesStateContextProvider data={notes}>
    {notes.itemsCount > 0 ? <NotesList /> : <NotesEmpty />}

    <NoteCreateModal />
  </NotesStateContextProvider>
)
