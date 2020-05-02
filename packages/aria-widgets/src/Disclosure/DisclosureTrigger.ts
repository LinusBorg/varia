import { defineComponent, computed, h, Ref, PropType } from 'vue'
import { useButton, ButtonProps, ButtonOptions } from '../Button'
import {
  injectDisclosureAPI,
  DisclosureAPIKey,
  DisclosureAPI,
} from './use-disclosure'

export function useDisclosureTrigger(
  props: ButtonOptions,
  api: DisclosureAPI,
  el?: Ref<HTMLElement | undefined>
) {
  const { show, id } = api

  const onClick = () => {
    show.value = !show.value
  }
  const btnAttrs = useButton(props, el)
  const attributes = computed(() => ({
    ...btnAttrs.value,
    'aria-expanded': show.value,
    'aria-controls': id,
    onClick,
  }))

  return attributes
}

export const DisclosureTrigger = defineComponent({
  name: 'DisclosureTrigger',
  props: {
    tag: {
      type: String,
      default: 'DIV',
    },
    apiKey: {
      type: Symbol as PropType<DisclosureAPIKey>,
    },
    ...ButtonProps,
  },
  setup(props, { slots }) {
    const api = injectDisclosureAPI(props.apiKey)
    const attributes = useDisclosureTrigger(props, api)
    return () => {
      return slots.replace
        ? slots.replace(attributes.value)
        : h(
            props.tag,
            {
              ...attributes.value,
            },
            slots.default?.(attributes.value)
          )
    }
  },
})
