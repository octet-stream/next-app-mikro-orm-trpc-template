"use client"

import {Fragment} from "react"
import type {FC} from "react"

import {useNoteStateSnapshot} from "context/NoteStateContext"
import {FakeNotesContext} from "context/FakeNotesContext"

import {NoteCompleteButton} from "component/NoteCompleteButton"
import {NoteCreateModal} from "component/NoteModal/NoteCreateModal"
import {Card} from "component/Card"

import {NoteNav} from "./NoteNav"
import {NoteTitle} from "./NoteTitle"
import {NoteInfo} from "./NoteInfo"
import {NoteDetails} from "./NoteDetails"
import {NoteFooter} from "./NoteFooter"

export const NoteView: FC = () => {
  const {isRejected} = useNoteStateSnapshot()

  return (
    <Fragment>
      <article className="w-full h-full flex flex-1 items-center justify-center">
        <Card className="w-full p-6 mobile:p-10 mobile:w-mobile mobile:max-w-full mobile:mx-auto">
          <NoteNav />

          <NoteTitle />

          <NoteInfo />

          <NoteDetails />

          {!isRejected && <NoteCompleteButton className="mt-10" />}

          <NoteFooter />
        </Card>

      </article>

      <FakeNotesContext>
        <NoteCreateModal redirect updateList={false} />
      </FakeNotesContext>
    </Fragment>
  )
}
