import {notFound} from "next/navigation"
import type {Metadata} from "next"

import {Note} from "server/db/entity"
import {getORM} from "server/lib/db/orm"
import {NoteStatus} from "server/trpc/type/common/NoteStatus"

import {patchStaticParams} from "lib/util/patchStaticParams"
import type {AFC} from "lib/type/AsyncFunctionComponent"
import {createEmojiIcon} from "lib/util/createEmojiIcon"

import {getNote} from "./_/loader/getNote"

import {NoteView} from "./_/component/NoteView"

// Revalidate page every 1 second, because dynamic segments are broken when the page is static. This value still will return old data on first render. This will likely be fixes in a future.
export const revalidate = 1

interface Params {
  id: string
}

interface Props {
  params: Params
}

function getEmojiForStatus(status: NoteStatus): string {
  switch (status) {
  case NoteStatus.COMPLETED:
    return "✅"
  case NoteStatus.REJECTED:
    return "🗑️"
  case NoteStatus.IN_PROGRESS:
    return "▶️"
  case NoteStatus.PAUSED:
    return "⏸️"
  default:
    return "📝"
  }
}

// TODO: Reuse getNote query here when I add cache
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
// TODO: Reuse getNote query here when I add cache
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const orm = await getORM()

  const {title, status} = await orm.em.findOneOrFail(Note, params.id, {
    disableIdentityMap: true,
    failHandler: notFound,
    filters: false,
    fields: ["title", "status"]
  })

  return {
    title,
    icons: {icon: createEmojiIcon(getEmojiForStatus(status))}
  }
}

const NoteViewPage: AFC<Props> = async ({params}) => {
  const note = await getNote(params.id)

  return <NoteView note={note} />
}

export default NoteViewPage
