import { ref, defineComponent, h, watch } from 'vue'
import { TemplRef, wrapProp, useElementFocusObserver } from '@varia/composables'
import { useClickable } from '../Clickable'

// export function useSkipToContent(_el?: TemplRef) {
//   const el = _el ?? ref()

//   watch(hasFocus, () => void 0)
//   return {
//     hasFocus: hasFocus,
//     attributes: {
//       ref: el,
//     },
//   }
// }

export const SkipToContent = defineComponent({
  name: 'SkipToContent',
  props: {
    tag: String,
    contentId: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const el: TemplRef = ref()
    const clickableAttrs = useClickable({}, el)
    const { hasFocus } = useElementFocusObserver(el)
    // This watch is required to work around a strange bug.
    watch(hasFocus, () => void 0)
    return () => {
      const tag = props.tag ? props.tag.toLowerCase() : 'a'
      return h(
        'a',
        {
          href: props.contentId,
          'data-varia-visually-hidden': hasFocus.value ? undefined : true,
          ...(tag === 'a' ? {} : clickableAttrs.value),
          //...attributes,
          ref: el,
        },
        slots.default?.()
      )
    }
  },
})
