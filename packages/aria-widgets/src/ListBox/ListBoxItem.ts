import { defineComponent, ref, computed, toRefs, h, PropType } from 'vue'
import { injectListBoxAPI } from './use-listbox'
import { useButton, ButtonProps } from '../Button'
import { ButtonOptions, ListBoxAPI, ListBoxAPIKey } from '../types'
import { useArrowNavigationChild } from 'vue-aria-composables'

export const listBoxItemProps = {
  tag: {
    type: String,
    default: 'DIV',
  },
  tabsKey: {
    type: Symbol as PropType<ListBoxAPIKey>,
  },
  label: {
    type: String,
  },
  item: {
    required: true,
  },
  ...ButtonProps,
}

export function useListBoxItem<Item = any>(
  props: ButtonOptions,
  api: ListBoxAPI<Item>
) {
  const el = ref<HTMLElement>()
  const id = api.genId(props.item)
  const onClick = () => {
    !props.disabled && props.name && api.select(props.name)
  }
  const isDisabled = computed(() => !!props.disabled)
  api.arrowNavAPI.addToElNavigation(id, isDisabled)
  const hasFocus = computed(
    () => !!el.value && api.arrowNavAPI.currentActiveId.value == id
  )

  const buttonAttrs = useButton(props, el)
  const arrowAttrs = useArrowNavigationChild(hasFocus, api.arrowNavAPI)
  return computed(() => ({
    ...buttonAttrs.value,
    ref: el,
    role: 'option',
    'aria-selected': api.selected.has(props.item),
    onClick,
  }))
}

export const ListBoxItem = defineComponent({
  name: 'ListboxItem',
  props: listBoxItemProps,
  setup(props, { slots }) {
    const { item, label } = toRefs(props)
    const api = injectListBoxAPI(props.tabsKey)
    const attributes = useListBoxItem(props, api)

    return () => {
      return slots.replace
        ? slots.replace(attributes)
        : h(
            props.tag,
            {
              ...attributes.value,
            },
            label?.value || slots.default?.(attributes.value)
          )
    }
  },
})
