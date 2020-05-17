import {
  defineComponent,
  reactive,
  Ref,
  provide,
  PropType,
  h,
  watch,
} from 'vue'
import {
  createCachedIdFn,
  wrapProp,
  useArrowNavigation,
} from '@varia/composables'

import { ListBoxOptions, ListBoxAPI, ListBoxAPIKey } from '../types'
import { createInjector } from '../utils/inject'

export const listBoxAPIKey = Symbol('listBoxAPI') as ListBoxAPIKey

export function useListBox(state: Ref<any[]>, options: ListBoxOptions = {}) {
  const {
    multiple,
    orientation = 'vertical',
    virtual = true,
    autoSelect = false,
  } = options

  // State
  // TODO: this should be cleaner and possibly abstracted away
  const selected = reactive(new Set(state.value))
  watch(state, s => {
    selected.clear()
    s.forEach(item => selected.add(item))
  })
  const select = (item: any) => {
    !multiple && selected.clear()
    selected.add(item)
    state.value = Array.from(selected)
  }
  const unselect = (item: any) => {
    selected.delete(item)
    state.value = Array.from(selected)
  }
  const toggle = (item: any) => {
    selected.has(item) ? unselect(item) : select(item)
  }
  // Keyboard navigation
  const arrowNavAPI = useArrowNavigation({
    orientation,
    startOnFirstSelected: true,
    virtual,
    autoSelect: multiple ? false : autoSelect,
  })

  // API
  const api: ListBoxAPI = {
    generateId: createCachedIdFn('listbox'),
    state: {
      selected,
      select,
      unselect,
      toggle,
    },
    arrowNavAPI,
    options,
  }
  provide(listBoxAPIKey, api)

  return api
}

export const injectListBoxAPI = createInjector(
  listBoxAPIKey,
  'injectListBoxAPI'
)

export const listBoxProps = {
  modelValue: {
    type: Array,
    default: () => [],
  },
  multiple: Boolean as PropType<boolean>,
  orientation: {
    type: String as PropType<'horizontal' | 'vertical'>,
  },
  autoSelect: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  virtual: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
}

export const ListBox = defineComponent({
  name: 'ListBox',
  props: listBoxProps,
  setup(props, { slots }) {
    const state = wrapProp(props, 'modelValue')
    const api = useListBox(state, props)
    console.log(api)
    return () =>
      h(
        'div',
        {
          role: 'listbox',
          ...api.arrowNavAPI.wrapperAttributes.value,
        },
        slots.default?.(api)
      )
  },
})
