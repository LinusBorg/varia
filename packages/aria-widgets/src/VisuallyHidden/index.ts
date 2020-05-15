import { defineComponent, h, PropType } from 'vue'

export const VisuallyHidden = defineComponent({
  name: 'VisuallyHidden',
  props: {
    tag: String,
    active: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        props.tag || 'DIV',
        {
          'data-varia-visually-hidden': props.active,
        },
        slots.default?.()
      )
  },
})
