import { defineComponent, h, PropType, computed } from 'vue'
import { AccordionAPI, AccordionAPIKey } from '../types'
import { injectAccordionAPI } from './use-accordion'

export interface AccordionContentProps {
  tag?: string
  tabsKey?: AccordionAPIKey
  name: string
}

export function useAccordionContent(
  props: AccordionContentProps,
  api: AccordionAPI
) {
  const id = api.generateId(props.name)
  const isExpanded = computed(() => api.state.selected.has(props.name))
  return {
    isExpanded,
    attributes: computed(() => ({
      id,
      'aria-labelledby': id,
    })),
  }
}

export const AccordionContent = defineComponent({
  name: 'AccordionHeader',
  props: {
    tag: String,
    tabsKey: Symbol as PropType<AccordionAPIKey>,
    name: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    const api = injectAccordionAPI(props.tabsKey)
    const { isExpanded, attributes } = useAccordionContent(props, api)

    return () =>
      isExpanded.value &&
      h(
        props.tag || 'DIV',
        attributes.value,
        slots.default?.({
          isExpanded: isExpanded.value,
          attributes: attributes.value,
        })
      )
  },
})
