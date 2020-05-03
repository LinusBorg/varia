import {
  createTemplateRefProvider,
  TemplateRefKey,
  useFocusGroup,
  useRovingTabIndex,
  useArrowKeys,
  useKeyIf,
} from 'vue-aria-composables'
import {
  ExtractPropTypes,
  reactive,
  provide,
  InjectionKey,
  readonly,
  Ref,
  ComputedRef,
} from 'vue'

export type ListboxAPIKey<Item = any> = InjectionKey<{
  selected: Set<Item>
  select: (item: Item) => void
  deselect: (item: Item) => void
  addToMap: (el: HTMLElement, item: Item) => void
  removeFromMap: (el: HTMLElement) => boolean
}>
export type ListBoxOptions = ExtractPropTypes<typeof props>

export const apiKey = Symbol('listBoxAPI') as ListboxAPIKey
export const elsKey = Symbol('listBoxEls') as TemplateRefKey

export const props = {
  multiple: {
    type: Boolean,
  },
}

export function useListbox<Item = any>(
  items: Item[],
  options: ListBoxOptions = {}
) {
  const { multiple } = options
  // Collect Elements
  const { elements, refFn } = createTemplateRefProvider(elsKey)

  // State
  const selected = reactive(new Set<Item>())
  const select = (item: Item) => {
    !multiple && selected.clear()
    selected.add(item)
  }
  const deselect = (item: Item) => selected.delete(item)

  /**
   * We need to map the elements of the ListBoxItems to the actual items they represent
   * With this mapping, we can e.g. get the Item represented by the DOM element that has focus
   * This this essential for the keyboard navigation features we implement further down.
   */
  const itemsElsMap = reactive(new Map<HTMLElement, Item>())
  const addToMap = (el: HTMLElement, item: Item) =>
    void itemsElsMap.set(el, item)
  const removeFromMap = (el: HTMLElement) => itemsElsMap.delete(el)

  // Keyboard navigation
  const { hasFocus, currentEl } = useFocusGroup(elements)
  const rover = useRovingTabIndex(elements, hasFocus)

  if (multiple) {
    const handleArrowKeys = (
      event: KeyboardEvent,
      direction: 'up' | 'down'
    ) => {
      const moveFocus = direction === 'up' ? rover.backward : rover.forward
      if (event.shiftKey) {
        moveFocus()
        // TODO: Do I need to wait for the next Tick here?
        const currentItem = currentEl.value && itemsElsMap.get(currentEl.value)!
        if (!currentItem) return
        selected.has(currentItem) ? select(currentItem) : deselect(currentItem)
      }
      if (event.ctrlKey) {
      }
    }
    useArrowKeys(hasFocus, {
      up: (event: KeyboardEvent) => handleArrowKeys(event, 'up'),
      down: (event: KeyboardEvent) => handleArrowKeys(event, 'up'),
    })

    useKeyIf(
      hasFocus,
      ['Home', 'End'],
      handleHomeEndKeys<Item>(currentEl, itemsElsMap, readonly(items), select)
    )
    useKeyIf(
      hasFocus,
      [' '],
      handleSpace<Item>(
        currentEl,
        itemsElsMap,
        selected,
        readonly(items),
        select
      )
    )
  }

  // API
  provide(apiKey as ListboxAPIKey<Item>, {
    selected,
    select,
    deselect,
    addToMap,
    removeFromMap,
  })

  return {
    ref: refFn,
    selected,
    select,
    deselect,
  }
}

function handleHomeEndKeys<Item = any>(
  currentEl: Ref<HTMLElement | undefined>,
  itemsElsMap: Map<HTMLElement, Item>,
  sortedItems: readonly Item[],
  select: (item: Item) => void
): (event: KeyboardEvent) => void {
  return event => {
    if (!event.shiftKey || !event.ctrlKey) return

    const currentItem = currentEl.value && itemsElsMap.get(currentEl.value)

    if (!currentItem) return

    const index = sortedItems.findIndex(item => item === currentItem)
    const itemsToSelect =
      event.key === 'Home'
        ? sortedItems.slice(0, index)
        : sortedItems.slice(index, sortedItems.length - 1)

    itemsToSelect.forEach(item => item && select(item))
  }
}

function handleSpace<Item = any>(
  currentEl: ComputedRef<HTMLElement | undefined>,
  itemsElsMap: Map<HTMLElement, Item>,
  selected: Set<Item>,
  sortedItems: readonly Item[],
  select: (item: Item) => void
): (event: KeyboardEvent) => void {
  return event => {
    if (!event.shiftKey) return

    const currentItem = currentEl.value && itemsElsMap.get(currentEl.value)
    const prevSelectedItem = Array.from(selected).pop()

    if (!currentItem || !prevSelectedItem) return
    const indexA = sortedItems.findIndex(item => item === currentItem)
    const indexB = sortedItems.findIndex(item => item === prevSelectedItem)

    if (indexA === indexB) return
    if (indexA === -1 || indexB === -1) return

    const itemsToSelect =
      indexA < indexB
        ? sortedItems.slice(indexB, indexA)
        : sortedItems.slice(indexB, indexA)

    itemsToSelect.forEach(item => item && select(item))
  }
}
