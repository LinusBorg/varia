import { ref, defineComponent, h, watch } from 'vue'
import {
  MaybeRef,
  TemplRef,
  wrapProp,
  useElementFocusObserver,
} from 'vue-aria-composables'
import { useClickable } from '../Clickable'

export function useSkipToContent(_el?: TemplRef) {
  const el = _el ?? ref()

  const { hasFocus } = useElementFocusObserver(el)

  return {
    hasFocus: hasFocus,
    attributes: {
      ref: el,
    },
  }
}

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
    const id = wrapProp(props, 'contentId')
    const el: TemplRef = ref()
    const clickableAttrs = useClickable({}, el)
    const { hasFocus, attributes } = useSkipToContent(el)

    return () => {
      const tag = props.tag ? props.tag.toLowerCase() : 'a'
      return h(
        'a',
        {
          href: props.contentId,
          'data-varia-visually-hidden': !hasFocus.value,
          ...(tag === 'a' ? {} : clickableAttrs.value),
          ...attributes,
        },
        slots.default?.()
      )
    }
  },
})
