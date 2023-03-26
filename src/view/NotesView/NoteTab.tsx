"use client"

import {useSearchParams, usePathname} from "next/navigation"
import type {ValueOf} from "type-fest"
import type {FC} from "react"
import {useMemo} from "react"

import Link from "next/link"
import cn from "clsx"

import {
  NoteStatusFilter,
  NoteStatusFilterNames
} from "server/trpc/type/common/NoteStatusFilter"

interface Props {
  name: ValueOf<typeof NoteStatusFilterNames>
  status: NoteStatusFilter
  active: boolean
}

export const NoteTab: FC<Props> = ({active, name, status}) => {
  const search = useSearchParams()
  const pathname = usePathname()

  const link = useMemo<string>(() => {
    const result = new URLSearchParams(search ?? [])

    if (status) {
      result.set("status", status)
    }

    return `${pathname}?${result.toString()}`
  }, [status, search, pathname])

  return (
    <Link replace href={link} className={cn("px-2 py-4 first:pl-4 last:pr-4 block", {underline: active, "no-underline": !active})}>
      {name}
    </Link>
  )
}
