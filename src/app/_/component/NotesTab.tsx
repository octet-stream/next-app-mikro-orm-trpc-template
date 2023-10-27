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
  className?: string
}

export const NoteTab: FC<Props> = ({active, name, status, className}) => {
  const search = useSearchParams()
  const pathname = usePathname()

  const link = useMemo<string>(() => {
    if (status === NoteStatusFilter.ALL) {
      return "/"
    }

    const result = new URLSearchParams(search ? search.toString() : [])

    if (status) {
      result.set("status", status)
    }

    // Reset page cursor if present, so we won't get 404 error
    if (result.has("page")) {
      result.set("page", "1")
    }

    return [pathname || "/", result.toString()].filter(Boolean).join("?")
  }, [status, search, pathname])

  return (
    <Link replace href={link} className={cn("px-2 py-4 first:pl-4 last:pr-4 block", {underline: active, "no-underline": !active}, className)}>
      {name}
    </Link>
  )
}
