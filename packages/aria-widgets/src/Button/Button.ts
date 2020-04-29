import { computed, defineComponent, PropType, h, reactive } from 'vue'
import { useClickable, ClickableOptions } from '../Clickable'
export function useButton(options: ClickableOptions) {
  return computed(() => ({
    ...useClickable(options),
    role: 'button' as const,
  }))
}

export const ButtonProps = {
  tag: { type: String, default: 'button' },
  disabled: { type: Boolean as PropType<boolean> },
  focusable: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  tabIndex: { type: [Number, String] },
}

export const Button = defineComponent({
  name: 'Button',
  props: ButtonProps,
  setup(props, { slots }) {
    const attributes = reactive(useButton(props))

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
