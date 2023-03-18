"use client"

import type {FC, ReactNode} from "react"
import {useRef} from "react"

import type {TNotesPageOutput} from "server/trpc/type/output/NotesPageOutput"

import {NotesStateContextProvider} from "./NotesStateContext"

interface Props {
  children: ReactNode
}

export const FakeNotesContext: FC<Props> = ({children}) => {
  const fakeNodes = useRef<TNotesPageOutput>({
    pagesCount: 1,
    rowsCount: 0,
    itemsCount: 0,
    items: [],
    prevCursor: null,
    nextCursor: null,
    limit: null,
    maxLimit: null,
    current: 1
  })

  return (
    <NotesStateContextProvider data={fakeNodes.current}>
      {children}
    </NotesStateContextProvider>
  )
}
