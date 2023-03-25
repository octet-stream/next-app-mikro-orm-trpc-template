import {Fragment} from "react"
import type {FC} from "react"

import type {ONoteOutput} from "server/trpc/type/output/NoteOutput"

import {NoteStateContextProvider} from "context/NoteStateContext"
import {FakeNotesContext} from "context/FakeNotesContext"

import {NoteCompleteButton} from "component/NoteCompleteButton"
import {NoteCreateModal} from "component/NoteModal/NoteCreateModal"
import {Card} from "component/Card"

import {NoteNav} from "./NoteNav"
import {NoteTitle} from "./NoteTitle"
import {NoteInfo} from "./NoteInfo"
import {NoteDetails} from "./NoteDetails"
import {NoteFooter} from "./NoteFooter"

interface Props {
  note: ONoteOutput
}

export const NoteView: FC<Props> = ({note}) => (
  <Fragment>
    <article className="w-full h-full flex flex-1 items-center justify-center">
      <Card className="w-full p-6 mobile:p-10 mobile:w-mobile mobile:max-w-full mobile:mx-auto">
        <NoteStateContextProvider data={note}>
          <NoteNav />

          <NoteTitle />

          <NoteInfo />

          <NoteDetails />

          {!note.isRejected && <NoteCompleteButton className="mt-10" />}

          <NoteFooter />
        </NoteStateContextProvider>
      </Card>
    </article>

    <FakeNotesContext>
      <NoteCreateModal redirect updateList={false} />
    </FakeNotesContext>
  </Fragment>
)
