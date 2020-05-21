import { defineComponent, h, computed, mergeProps, PropType, Ref } from 'vue'
import { useButton, ButtonProps } from '../Button'
import { wrapProp } from '@varia/composables'
import { ToggleButtonOptions } from '../types'

export function useToggleButton(
  state: Ref<boolean | undefined>,
  options: ToggleButtonOptions
) {
  const btnAttrs = useButton(options)
  const attributes = computed(() =>
    mergeProps(btnAttrs.value, {
      'aria-pressed': state.value,
      onClick: () => (state.value = !state.value),
    })
  )
  return attributes
}

const toggleButtonProps = {
  ...ButtonProps,
  modelValue: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
}
export const ToggleButton = defineComponent({
  name: 'ToggleButton',
  props: toggleButtonProps,
  setup(props, { slots }) {
    const state = wrapProp(props, 'modelValue')
    const attributes = useToggleButton(state, props)
    return () =>
      h(props.tag || 'button', attributes.value, slots.default?.(attributes))
  },
})
