import {
  defineComponent,
  Ref,
  inject,
  ref,
  watch,
  computed,
  toRefs,
  h,
} from 'vue'
import { apiKey, elsKey } from './use-listbox'
import { useButton, ButtonProps, ButtonOptions } from '../Button'
import { useParentElementInjection } from 'vue-aria-composables'

export function useListBoxItem<Item = any>(
  item: Ref<Item>,
  props: ButtonOptions,
  label?: Ref<string | undefined>
) {
  const el = ref<HTMLElement>()
  useParentElementInjection(el, elsKey)

  const api = inject(apiKey)
  if (!api) {
    throw new Error(
      '<ListBoxItem>: you have to call `useListbox()` in a parent'
    )
  }

  watch(el, (el, _, onCleanup) => {
    el && api.addToMap(el, item.value)
    onCleanup(() => el && api.removeFromMap(el))
  })

  const onClick = () => {
    api.select(item.value)
  }

  const buttonAttrs = useButton(props, el)
  return computed(() => ({
    ...buttonAttrs.value,
    ref: el,
    role: 'option',
    'aria-selected': api.selected.has(item.value),
    'aria-label': label?.value,
    onClick,
  }))
}

export const ListBoxItem = defineComponent({
  name: 'ListboxItem',
  props: {
    tag: {
      type: String,
      default: 'DIV',
    },
    label: {
      type: String,
    },
    item: {
      required: true,
    },
    ...ButtonProps,
  },
  setup(props, { slots }) {
    const { item, label } = toRefs(props)
    const attributes = useListBoxItem(item, props, label)

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
