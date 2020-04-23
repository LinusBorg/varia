import { computed, defineComponent, PropType, h } from 'vue'
import { useClickable, ClickableOptions } from '../Clickable'
export function useButton(options: ClickableOptions) {
  return computed(() => ({
    ...useClickable(options),
    role: 'button' as const,
  }))
}

export const Button = defineComponent({
  name: 'Button',
  props: {
    tag: { type: String, default: 'BUTTON' },
    disabled: { type: Boolean as PropType<boolean | undefined> },
    focusable: {
      type: Boolean as PropType<boolean | undefined>,
      default: true,
    },
    tabIndex: { type: [Number, String] },
  },
  setup(props, { slots }) {
    const attributes = useButton(props)

    return () => {
      return slots.replace
        ? slots.replace(attributes.value)
        : h(
            props.tag,
            {
              ...attributes.value,
            },
            slots.default?.(attributes)
          )
    }
  },
})
