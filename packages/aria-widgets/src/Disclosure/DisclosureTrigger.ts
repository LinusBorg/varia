import { defineComponent, h } from 'vue'
import { Button } from '../Button'
import { injectDisclosureContext } from './use-disclosure'
export const DisclosureTrigger = defineComponent({
  name: 'DisclosureTrigger',
  components: {
    Button,
  },
  props: {
    tag: {
      type: String,
      default: 'DIV',
    },
  },
  setup(props, { slots }) {
    const { triggerAttrs: attributes } = injectDisclosureContext()
    return () => {
      return slots.replace
        ? slots.replace(attributes.value)
        : h(
            Button,
            {
              ...attributes.value,
              tag: props.tag,
            },
            () => slots.default?.(attributes)
          )
    }
  },
})
