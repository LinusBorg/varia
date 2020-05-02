import { defineComponent, h } from 'vue'
export default defineComponent({
  name: 'TabList',
  props: {
    tag: {
      type: String,
      default: 'DIV',
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        props.tag,
        {
          role: 'tablist',
        },
        slots.default?.()
      )
  },
})
