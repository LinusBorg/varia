import { defineComponent, h, PropType, computed, ref } from 'vue'
import { AccordionAPI, AccordionAPIKey } from '../types'
import { injectAccordionAPI } from './use-accordion'
import { Button } from '../Button'

export type AccordionHeaderProps = {
  tag?: string
  headingLevel: number
  name: string
  tabsKey?: AccordionAPIKey
}
export function useAccordionHeader(
  props: AccordionHeaderProps,
  api: AccordionAPI
) {
  const { name, headingLevel } = props
  const id = api.generateId(props.name)
  api.arrowNav.addToElNavigation(id, ref(false)) // TODO: add disabled behaviour
  const isExpanded = computed(() => api.state.selected.has(props.name))
  return computed(() => ({
    'aria-expanded': isExpanded.value,
    'aria-controls': id,
    onClick: () =>
      isExpanded.value
        ? api.state.unselect(props.name)
        : api.state.select(props.name),
  }))
}

export const accordionHeaderProps = {
  tag: String,
  h: {
    type: [Number, String],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  tabsKey: Symbol as PropType<AccordionAPIKey>,
}

export const AccordionHeader = defineComponent({
  name: 'AccordionHeader',
  props: accordionHeaderProps,
  setup(props, { slots }) {
    const api = injectAccordionAPI(props.tabsKey)
    const attributes = useAccordionHeader(props as AccordionHeaderProps, api)

    return () =>
      h('h' + props.h || '1', [
        h(Button, { tag: props.tag, ...attributes.value }, () =>
          slots.default?.(attributes.value)
        ),
      ])
  },
})
