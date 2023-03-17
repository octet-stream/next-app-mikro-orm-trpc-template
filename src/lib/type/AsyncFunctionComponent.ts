import type {ReactElement, WeakValidationMap} from "react"

import type {MaybePromise} from "./MaybePromise"
import type {MaybeNull} from "./MaybeNull"

export interface AsyncFunctionComponent<P = {}> {
  propTypes?: WeakValidationMap<P> | undefined;
  defaultProps?: Partial<P> | undefined;
  displayName?: string | undefined;

  (
    props: P,
    context: any
  ): MaybePromise<MaybeNull<ReactElement>>
}

export type AFC<P = {}> = AsyncFunctionComponent<P>
