import type {PageOutput} from "server/trpc/helper/Page"

/**
 * Adds a new `item` to given `page` state
 *
 * @param page Page state object to update
 * @param item A new item to add
 */
export function addPageItem<
  TPageType extends object,
  TNewItem extends TPageType
>(
  page: PageOutput<TPageType>,
  item: TNewItem
): void {
  page.items.unshift(item)
  page.rowsCount++

  if (!page.maxLimit || page.itemsCount + 1 < page.maxLimit) {
    page.itemsCount++
  } else {
    page.items.pop()
  }
}
