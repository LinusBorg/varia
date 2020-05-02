import { defineComponent, h, computed, Ref, PropType } from 'vue'
import {
  injectDisclosureAPI,
  DisclosureAPI,
  DisclosureAPIKey,
} from './use-disclosure'

export function useDisclosureContent(
  disclosureAPI: DisclosureAPI,
  el?: Ref<HTMLElement | undefined>
) {
  const { id, show } = disclosureAPI
  const attributes = computed(() => ({
    ref: el,
    id,
    style: !show.value ? 'display: none' : undefined,
    'aria-hidden': !show.value,
  }))

  return { show, attributes }
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
    const { show, attributes } = useDisclosureContent(api)
    return () => {
      return h(
        props.tag,
        attributes.value,
        slots.default?.({ attributes: attributes.value, show: show.value })
      )
    }
  },
})
