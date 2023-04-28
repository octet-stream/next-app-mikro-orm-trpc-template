import type {FC, ReactNode} from "react"
import type {Metadata} from "next"

import {Toaster} from "component/Toaster"

import {createEmojiIcon} from "lib/util/createEmojiIcon"

import "style/tailwind.css"

export const metadata: Metadata = {
  title: {
    default: "Simple Notes",
    template: "%s — Simple Notes"
  },
  icons: {
    icon: createEmojiIcon("📝")
  }
}

interface Props {
  children: ReactNode
}

const RootLayout: FC<Props> = ({children}) => (
  <html lang="en">
    {/*
      <head /> will contain the components returned by the nearest parent
      head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
    */}
    <head />

    <body className="bg-white dark:bg-slate-700 text-black dark:text-white">
      <main className="w-screen h-screen">
        <div className="min-h-screen w-full lg:max-w-laptop lg:mx-auto lg:py-5 p-5 flex flex-col">
          {children}
        </div>
      </main>

      <Toaster position="top-center" />
    </body>
  </html>
)

export default RootLayout
