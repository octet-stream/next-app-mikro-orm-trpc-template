import type {Metadata} from "next"

import {Note} from "server/db/entity"
import {getORM} from "server/lib/db/orm"
import type {TNotesPageOutput} from "server/trpc/type/output/NotesPageOutput"

import type {AFC} from "lib/type/AsyncFunctionComponent"
import {createCaller} from "lib/trpc/server"

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

// TODO: Optimise this, maybe with cache on tRPC level
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const orm = await getORM()

  const {title} = await orm.em.findOneOrFail(Note, params.id, {
    disableIdentityMap: true
  })

  return {
    title
  }
}

const getNote = createCaller((trpc, id: string) => trpc.note.getById({id}))

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
