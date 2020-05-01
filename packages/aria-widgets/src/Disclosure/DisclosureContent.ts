import { defineComponent, h, computed, Ref } from 'vue'
import { injectDisclosureAPI } from './use-disclosure'

export function useDisclosureContent(el?: Ref<HTMLElement | undefined>) {
  const { state: show, id } = injectDisclosureAPI()
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
  },
  setup(props, { slots }) {
    const { show, attributes } = useDisclosureContent()
    return () => {
      return h(
        props.tag,
        attributes.value,
        slots.default?.({ attributes: attributes.value, show: show.value })
      )
    }
  },
})
