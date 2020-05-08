import { defineComponent, h, computed, Ref, PropType } from 'vue'
import { injectDisclosureAPI } from './use-disclosure'

import { DisclosureAPIKey, DisclosureAPI } from '../types'

export function useDisclosureContent(
  api: DisclosureAPI,
  el?: Ref<HTMLElement | undefined>
) {
  const {
    state: { selected: isOpen },
    options: { id },
  } = api
  const attributes = computed(() => ({
    ref: el,
    id,
    style: !isOpen.value ? 'display: none' : undefined,
    'aria-hidden': !isOpen.value,
  }))

  return { isOpen, attributes }
}

export const DisclosureContent = defineComponent({
  name: 'Disclosure',
  props: {
    tag: {
      type: String,
      default: 'DIV',
    },
    apiKey: {
      type: Symbol as PropType<DisclosureAPIKey>,
    },
  },
  setup(props, { slots }) {
    const api = injectDisclosureAPI(props.apiKey)
    const { isOpen, attributes } = useDisclosureContent(api)
    return () => {
      return h(
        props.tag,
        attributes.value,
        slots.default?.({ attributes: attributes.value, isOpen: isOpen.value })
      )
    }
  },
})
