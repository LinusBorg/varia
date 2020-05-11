import { ArrowNavigation, useIdGenerator } from 'vue-aria-composables'
import {
  ExtractPropTypes,
  reactive,
  provide,
  inject,
  InjectionKey,
  readonly,
  Ref,
} from 'vue'
import { useArrowNavigation } from 'packages/aria-composables/dist'

import { ListBoxOptions, ListBoxAPIKey } from '../types'

export const listBoxAPIKey = Symbol('listBoxAPI') as ListBoxAPIKey

export const props = {
  multiple: {
    type: Boolean,
  },
}

export function useListbox<Item = any>(
  initial: Item[] | Set<Item>,
  options: ListBoxOptions = {}
) {
  const { multiple } = options

  // State
  const selected = reactive(new Set<Item>(initial))
  const select = (item: Item) => {
    !multiple && selected.clear()
    selected.add(item)
  }
  const deselect = (item: Item) => selected.delete(item)
  const toggle = (item: Item) =>
    selected.has(item) ? selected.delete(item) : selected.add(item)
  // Keyboard navigation
  const arrowNavAPI = useArrowNavigation({
    orientation: 'vertical',
  })

  // API
  provide(listBoxAPIKey as ListBoxAPIKey<Item>, {
    genId: useIdGenerator('listbox'),
    selected,
    select,
    deselect,
    arrowNavAPI,
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
