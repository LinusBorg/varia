import {
  defineComponent,
  ref,
  computed,
  toRefs,
  h,
  PropType,
  inject,
  mergeProps,
} from 'vue'
import { useArrowNavigationItem, TemplRef } from '@varia/composables'
import { injectListBoxAPI, listBoxAPIKey } from './useListBox'
import { useButton, ButtonProps } from '../Button'
import { ButtonOptions, ListBoxAPI, ListBoxAPIKey } from '../types'

export const listBoxItemProps = {
  ...ButtonProps,
  tag: {
    type: String,
    default: 'DIV',
  },
  apiKey: {
    type: Symbol as PropType<ListBoxAPIKey>,
  },
  label: {
    type: String,
  },
  item: {
    required: true,
  },
}

export function useListBoxItem(props: ButtonOptions, api: ListBoxAPI) {
  const el: TemplRef = ref()
  const onClick = () => {
    if (!props.disabled && props.item) {
      api.options.autoSelect
        ? api.state.select(props.item)
        : api.state.toggle(props.item)
    }
  }
  const isDisabled = computed(() => !!props.disabled)
  const isSelected = computed(() => api.state.selected.has(props.item))

  // Arrow Navigation
  const id = api.generateId(props.item)
  // api.arrowNavAPI.addIdToNavigation(id, isDisabled)
  // const hasFocus = computed(() => api.arrowNavAPI.currentActiveId.value === id)

  // Attributes
  const buttonAttrs = useButton(props, el)
  const arrowAttrs = useArrowNavigationItem(
    {
      id,
      isDisabled,
    },
    api.arrowNav
  )
  return computed(() =>
    mergeProps(buttonAttrs.value, arrowAttrs.value, {
      id,
      role: 'option' as const,
      'aria-selected': isSelected.value,
      onClick,
      ref: el,
    })
  )
}

export const ListBoxItem = defineComponent({
  name: 'ListboxItem',
  props: listBoxItemProps,
  setup(props, { slots }) {
    const { label } = toRefs(props)
    const api = inject(listBoxAPIKey)
    const attributes = useListBoxItem(props, api!)

    return () => {
      return h(
        props.tag,
        {
          ...attributes.value,
        },
        label?.value || slots.default?.(attributes.value)
      )
    }
  },
})
