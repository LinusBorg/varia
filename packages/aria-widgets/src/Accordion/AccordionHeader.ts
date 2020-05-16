import { defineComponent, h, PropType, computed, toRef } from 'vue'
import { AccordionAPI, AccordionAPIKey, ButtonOptions } from '../types'
import { injectAccordionAPI } from './use-accordion'
import { ButtonProps, useButton } from '../Button'
import { useArrowNavigationChild, createId } from '@varia/composables'

export interface AccordionHeaderProps extends ButtonOptions {
  tag?: string
  headingLevel: number
  name: string
  tabsKey?: AccordionAPIKey
}
export function useAccordionHeader(
  props: AccordionHeaderProps,
  api: AccordionAPI
) {
  const id = createId()
  const contentId = api.generateId(props.name)

  // Derrived state
  const isExpanded = computed(() => api.state.selected.has(props.name))
  const hasFocus = computed(() => api.arrowNav.currentActiveId.value === id)
  const isDisabled = toRef(props, 'disabled')
  api.arrowNav.addToElNavigation(id, isDisabled)

  // Derrived Element Attributes
  const btnAttrs = useButton(props)
  const arrowAttrs = useArrowNavigationChild(hasFocus, api.arrowNav)
  return computed(() => ({
    ...btnAttrs.value,
    ...arrowAttrs.value,
    id,
    'aria-expanded': isExpanded.value,
    'aria-controls': contentId,
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
  ...ButtonProps,
}

export const AccordionHeader = defineComponent({
  name: 'AccordionHeader',
  props: accordionHeaderProps,
  setup(props, { slots }) {
    const api = injectAccordionAPI(props.tabsKey)
    const attributes = useAccordionHeader(props as AccordionHeaderProps, api)

    return () =>
      h('h' + props.h || '1', [
        h(
          props.tag || 'button',
          attributes.value,
          slots.default?.(attributes.value)
        ),
      ])
  },
})
