import {
  defineComponent,
  Ref,
  ref,
  watchEffect,
  computed,
  toRefs,
  h,
  PropType,
} from 'vue'
import { ListBoxAPI, ListBoxAPIKey, injectListBoxAPI } from './use-listbox'
import { useButton, ButtonProps } from '../Button'
import { ButtonOptions } from '../types'

export function useListBoxItem<Item = any>(
  item: Ref<Item>,
  props: ButtonOptions,
  api: ListBoxAPI<Item>,
  label?: Ref<string | undefined>
) {
  const el = ref<HTMLElement>()

  const onClick = () => {
    !props.disabled && props.name && api.select(props.name)
  }

  const isTrulyDisabled = computed(() => props.disabled && !props.focusable)
  const hasFocus = computed(
    () => el.value && api.currentFocusEl.value == el.value
  )
  // Link into the templateRef API for A11y
  watchEffect(() => {
    if (el.value) {
      isTrulyDisabled.value
        ? api.removeElFromArrowSequence(el.value)
        : api.addElToArrowSequence(el.value, props.name!)
    }
  })

  const buttonAttrs = useButton(props, el)
  return computed(() => ({
    ...buttonAttrs.value,
    ref: el,
    role: 'option',
    'aria-selected': api.selected.has(item.value),
    'aria-label': label?.value,
    tabIndex: hasFocus.value ? 0 : 1,
    onClick,
  }))
}

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

export const ListBoxItem = defineComponent({
  name: 'ListboxItem',
  props: listBoxItemProps,
  setup(props, { slots }) {
    const { item, label } = toRefs(props)
    const api = injectListBoxAPI(props.tabsKey)
    const attributes = useListBoxItem(item as Ref<any>, props, api, label)

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
