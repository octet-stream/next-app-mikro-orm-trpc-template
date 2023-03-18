import {notFound} from "next/navigation"
import type {Metadata} from "next"

import {Note} from "server/db/entity"
import {getORM} from "server/lib/db/orm"

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

// TODO: Optimise this, maybe with cache on tRPC level
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const orm = await getORM()

  const {title} = await orm.em.findOneOrFail(Note, params.id, {
    disableIdentityMap: true,
    failHandler: notFound,
    filters: false
  })

  return {
    title
  }
}

const getNote = createCaller((trpc, id: string) => trpc.note.getById({id}))

const NoteViewPage: AFC<Props> = async ({params}) => {
  const note = await getNote(params.id)

  return (
    <NoteStateContextProvider data={note}>
      <NoteView />
    </NoteStateContextProvider>
  )
}

export default NoteViewPage
