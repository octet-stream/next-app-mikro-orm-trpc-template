import type {PartialDeep} from "type-fest"
import eq from "fast-deep-equal"

const DEFAULT_CACHE_LIMIT = 1000

interface CacheKey<T = unknown> {
  path: string
  rawInput: T
  meta?: unknown
}

interface CacheEntry<TValue extends object = object, TInput = unknown> {
  key: CacheKey<TInput>
  value: TValue
}

type CacheEntries = CacheEntry[]

interface CacheOptions {
  limit?: number
}

function matchEntry(
  entry: PartialDeep<CacheEntry>,
  key: PartialDeep<CacheKey>
): boolean {
  const matchers = [
    [key.path, entry?.key?.path],
    [key.rawInput, entry?.key?.rawInput],
    [key.meta, entry?.key?.meta]
  ].filter(([a, b]) => !!a && !!b)

  return matchers.every(([a, b]) => eq(a, b))
}

/**
 * Simple FIFO cache for tRPC procedures
 */
export class ProcedureCache {
  #limit: number = DEFAULT_CACHE_LIMIT

  #entries: CacheEntries = []

  constructor(options: CacheOptions = {}) {
    if (options.limit) {
      this.#limit = options.limit
    }
  }

  set(key: CacheKey, value: object): void {
    if (this.#entries.length >= this.#limit) {
      this.#entries.pop()
    }

    this.#entries.unshift({key, value})
  }

  get<TValue extends object>(key: PartialDeep<CacheKey>): TValue | null {
    for (const entry of this.#entries) {
      if (matchEntry(entry, key)) {
        return entry.value as TValue
      }
    }

    return null
  }

  revalidate(key: PartialDeep<CacheKey>, value: object): boolean {
    for (const entry of this.#entries) {
      if (matchEntry(entry, key)) {
        entry.value = value

        return true
      }
    }

    return false
  }

  clear() {
    this.#entries = []
  }
}
