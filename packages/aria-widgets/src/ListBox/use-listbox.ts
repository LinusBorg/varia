import {
  TemplateRefKey,
  useFocusGroup,
  useRovingTabIndex,
  useArrowKeys,
  useKeyIf,
  createTemplateRefAPI,
} from 'vue-aria-composables'
import {
  ExtractPropTypes,
  reactive,
  provide,
  inject,
  InjectionKey,
  readonly,
  Ref,
  ComputedRef,
} from 'vue'

export interface ListBoxAPI<Item> {
  selected: Set<Item>
  select: (item: Item) => void
  deselect: (item: Item) => void
  currentFocusEl: Ref<HTMLElement | undefined>
  addElToArrowSequence: (el: HTMLElement, item: Item) => void
  removeElFromArrowSequence: (el: HTMLElement) => void
}
export type ListBoxAPIKey<Item = any> = InjectionKey<ListBoxAPI<Item>>
export type ListBoxOptions = ExtractPropTypes<typeof props>

export const listBoxAPIKey = Symbol('listBoxAPI') as ListBoxAPIKey
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

  // State
  const selected = reactive(new Set<Item>())
  const select = (item: Item) => {
    !multiple && selected.clear()
    selected.add(item)
  }
  const deselect = (item: Item) => selected.delete(item)

  // Keyboard navigation
  const {
    elements,
    add: addElToArrowSequence,
    remove: removeElFromArrowSequence,
    elementsToItems,
  } = createTemplateRefAPI()
  const { hasFocus, currentEl: currentFocusEl } = useFocusGroup(elements)
  const rover = useRovingTabIndex(elements, hasFocus, {
    orientation: 'vertical',
  })

  if (multiple) {
    const handleArrowKeys = (
      event: KeyboardEvent,
      direction: 'up' | 'down'
    ) => {
      const moveFocus = direction === 'up' ? rover.backward : rover.forward
      if (event.shiftKey) {
        moveFocus()
        // TODO: Do I need to wait for the next Tick here?
        const currentItem =
          currentFocusEl.value && elementsToItems.get(currentFocusEl.value)!
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
      handleHomeEndKeys<Item>(
        currentFocusEl,
        elementsToItems,
        readonly(items),
        select
      )
    )
    useKeyIf(
      hasFocus,
      [' '],
      handleSpace<Item>(
        currentFocusEl,
        elementsToItems,
        selected,
        readonly(items),
        select
      )
    )
  }

  // API
  provide(listBoxAPIKey as ListBoxAPIKey<Item>, {
    selected,
    select,
    deselect,
    currentFocusEl,
    addElToArrowSequence,
    removeElFromArrowSequence,
  })

  return {
    selected: readonly(selected),
    select,
    deselect,
  }
}

export function injectListBoxAPI(key: ListBoxAPIKey = listBoxAPIKey) {
  const api = inject(key)
  if (!api) {
    console.warn('<Tab />: useTabs() was not called in parent component')
    throw new Error('Missing TabsAPI Injection from parent component')
  }
  return api
}

function handleHomeEndKeys<Item = any>(
  currentFocusEl: Ref<HTMLElement | undefined>,
  itemsElsMap: Readonly<Map<HTMLElement, Item>>,
  sortedItems: readonly Item[],
  select: (item: Item) => void
): (event: KeyboardEvent) => void {
  return event => {
    if (!event.shiftKey || !event.ctrlKey) return

    const currentItem =
      currentFocusEl.value && itemsElsMap.get(currentFocusEl.value)

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
  currentFocusEl: ComputedRef<HTMLElement | undefined>,
  itemsElsMap: Readonly<Map<HTMLElement, Item>>,
  selected: Set<Item>,
  sortedItems: readonly Item[],
  select: (item: Item) => void
): (event: KeyboardEvent) => void {
  return event => {
    if (!event.shiftKey) return

    const currentItem =
      currentFocusEl.value && itemsElsMap.get(currentFocusEl.value)
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
