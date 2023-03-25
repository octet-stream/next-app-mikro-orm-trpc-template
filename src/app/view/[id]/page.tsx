import {notFound} from "next/navigation"
import type {Metadata} from "next"

import {Note} from "server/db/entity"
import {getORM} from "server/lib/db/orm"

import {createCaller} from "lib/trpc/server"
import type {AFC} from "lib/type/AsyncFunctionComponent"
import {patchStaticParams} from "lib/util/patchStaticParams"

import {NoteView} from "view/NoteView/NoteView"

// Revalidate page every 1 second, because dynamic segments are broken when the page is static. This value still will return old data on first render. This will likely be fixes in a future.
export const revalidate = 1

interface Params {
  id: string
}

interface Props {
  params: Params
}

const getNote = createCaller((trpc, id: string) => trpc.note.getById({id}))

export const generateStaticParams = patchStaticParams<Params>(async () => {
  const orm = await getORM()

  const notes = await orm.em.find(Note, {}, {
    disableIdentityMap: true,
    filters: false,
    fields: ["id"]
  })

  return notes.map(({id}) => ({id}))
})

// TODO: Optimise this, maybe with cache on tRPC level
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const orm = await getORM()

  const {title} = await orm.em.findOneOrFail(Note, params.id, {
    disableIdentityMap: true,
    failHandler: notFound,
    filters: false,
    fields: ["title"]
  })

  return {
    title
  }
}

const NoteViewPage: AFC<Props> = async ({params}) => {
  const note = await getNote(params.id)

  return <NoteView note={note} />
}

export default NoteViewPage
