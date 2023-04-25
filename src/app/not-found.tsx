import type {Metadata} from "next"
import type {FC} from "react"

import Link from "next/link"

export const metadata: Metadata = {
  title: "Page not found"
}

const NotFound: FC = () => (
  <div className="flex-1 flex flex-col justify-center items-center text-center">
    <div className="text-8xl font-bold">
      404
    </div>

    <div className="mt-1">
      Couldn&apos;d find the page you are looking for.
    </div>

    <div>
      You can try and check the page&apos;s address, or return to the <Link href="/" className="underline" replace>home page</Link>.
    </div>
  </div>
)

export default NotFound
