import type {Metadata} from "next"

import {Note} from "server/db/entity"
import {getORM} from "server/lib/db/orm"
import {NoteStatus} from "server/trpc/type/common/NoteStatus"

import {patchStaticParams} from "lib/util/patchStaticParams"
import type {AFC} from "lib/type/AsyncFunctionComponent"
import {createEmojiIcon} from "lib/util/createEmojiIcon"

import {getNote} from "./_/loader/getNote"

import {NoteView} from "./_/component/NoteView"

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

export const generateStaticParams = patchStaticParams<Params>(async () => {
  const orm = await getORM()

  const notes = await orm.em.find(Note, {}, {
    disableIdentityMap: true,
    filters: false,
    fields: ["id"]
  })

  return notes.map(({id}) => ({id}))
})

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {title, status} = await getNote(params.id)

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
