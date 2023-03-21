import type {Metadata} from "next"

import type {AFC} from "lib/type/AsyncFunctionComponent"
import {createCaller} from "lib/trpc/server"

import {NoteStateContextProvider} from "context/NoteStateContext"

import {NoteView} from "view/NoteView/NoteView"

export const revalidate = 0

interface Params {
  id: string
}

interface Props {
  params: Params
}

const getNote = createCaller((trpc, id: string) => trpc.note.getById({id}))

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {title} = await getNote(params.id)

  return {
    title
  }
}

const NoteViewPage: AFC<Props> = async ({params}) => {
  const note = await getNote(params.id)

  return (
    <NoteStateContextProvider data={note}>
      <NoteView />
    </NoteStateContextProvider>
  )
}

export default NoteViewPage
