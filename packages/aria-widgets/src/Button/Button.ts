import { computed, defineComponent, h, Ref, toRaw } from 'vue'
import { useClickable, ClickableProps } from '../Clickable'

import { ButtonOptions } from '../types'

export const ButtonProps = {
  tag: { type: String, default: 'button' },
  ...ClickableProps,
}

export function useButton(
  options: ButtonOptions,
  el?: Ref<HTMLElement | undefined>
) {
  return computed(() => ({
    ...useClickable(options, el).value,
    role: 'button' as const,
  }))
}

export const Button = defineComponent({
  name: 'Button',
  props: ButtonProps,
  setup(props, { slots }) {
    console.log(toRaw(props))
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
