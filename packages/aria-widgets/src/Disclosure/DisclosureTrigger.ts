import { defineComponent, computed, h, Ref } from 'vue'
import { useButton, ButtonProps, ButtonOptions } from '../Button'
import { injectDisclosureAPI } from './use-disclosure'

export function useDisclosureTrigger(
  props: ButtonOptions,
  el?: Ref<HTMLElement>
) {
  const { state, id } = injectDisclosureAPI()

  const onClick = () => {
    state.value = !state.value
  }
  const btnAttrs = useButton(props, el)
  const attributes = computed(() => ({
    ...btnAttrs.value,
    'aria-expanded': state.value,
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
    ...ButtonProps,
  },
  setup(props, { slots }) {
    const attributes = useDisclosureTrigger(props)
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
