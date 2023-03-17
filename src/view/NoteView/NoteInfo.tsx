"use client"

import type {FC} from "react"

import {useNoteStateSnapshot} from "context/NoteStateContext"
import {formatRelative} from "lib/util/formatRelative"

export const NoteInfo: FC = () => {
  const {createdAt} = useNoteStateSnapshot()

  return (
    <div className="text-gray-400 dark:text-gray-600 text-xs select-none">
      noted {formatRelative(createdAt, Date.now())}
    </div>
  )
}
