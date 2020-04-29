// <template>
//   <div v-if="show" :is="tag" v-bind="attributes"></div>
// </template>

import { defineComponent, h, computed } from 'vue'
import { injectDisclosureContext } from './use-disclosure'
export const DisclosureContent = defineComponent({
  name: 'Disclosure',
  props: {
    tag: {
      type: String,
      default: 'DIV',
    },
  },
  setup(props, { slots }) {
    const { contentAttrs, show } = injectDisclosureContext()
    const attributes = computed(() =>
      show.value
        ? contentAttrs.value
        : {
            ...contentAttrs.value,
            style: 'display: none',
          }
    )
    return () => {
      return h(props.tag, attributes.value, slots.default?.(attributes.value))
    }
  },
})
