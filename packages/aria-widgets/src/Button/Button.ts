import { computed, defineComponent, PropType, h, reactive, Ref } from 'vue'
import { useClickable, ClickableOptions } from '../Clickable'

export type ButtonOptions = ClickableOptions
export function useButton(
  options: ClickableOptions,
  el?: Ref<HTMLElement | undefined>
) {
  return computed(() => ({
    ...useClickable(options, el).value,
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
