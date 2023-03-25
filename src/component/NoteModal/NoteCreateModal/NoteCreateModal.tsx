"use client"

/* eslint-disable react/no-unstable-nested-components */

import type {SubmitHandler} from "react-hook-form"
import {useEvent} from "react-use-event-hook"
import {useRouter} from "next/navigation"
import {toast} from "react-hot-toast"
import type {FC} from "react"

import isString from "lodash/isString"

import {NoteCreateInput} from "server/trpc/type/input/NoteCreateInput"
import type {INoteCreateInput} from "server/trpc/type/input/NoteCreateInput"

import {addPageItem} from "lib/util/patchPageState"
import {client} from "lib/trpc/client"

import {useNotesStateProxy} from "context/NotesStateContext"

import {createNoteModal} from "../createNoteModal"

import {Open} from "./Open"

const Modal = createNoteModal({
  name: "Create",
  validate: NoteCreateInput
})

type Submit = SubmitHandler<Omit<INoteCreateInput, "completions">>

interface Props {
  updateList?: boolean
  redirect?: string | boolean
}

export const NoteCreateModal: FC<Props> = ({
  updateList = true,
  redirect
}) => {
  const router = useRouter()
  const state = useNotesStateProxy()

  const submit = useEvent<Submit>(async data => {
    try {
      const created = await client.note.create.mutate(data)

      if (updateList) {
        addPageItem(state, created)
      }

      if (redirect) {
        router.replace(isString(redirect) ? redirect : `/view/${created.id}`)
      }
    } catch (error) {
      console.error(error)
      toast.error("Can't create a note")
    }
  })

  return (
    <Modal
      title="Add a note"
      submit={submit}
      openButton={Open}
    />
  )
}
