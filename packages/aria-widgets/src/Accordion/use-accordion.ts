import { provide, reactive, defineComponent, PropType } from 'vue'
import { createCachedIdFn, useArrowNavigation } from '@varia/composables'
import { createInjector } from '../utils/inject'
import { AccordionOptions, AccordionAPIKey } from '../types'
import { ClickableProps } from '../Clickable'

export type AccordionState = Set<string>

export const accordionKey = Symbol('disclosure') as AccordionAPIKey

export function useAccordion(
  options: AccordionOptions = {},
  _state: AccordionState
) {
  const {
    orientation = 'vertical',
    multiple = false,
    loop = false,
    customName,
  } = options

  //Accordion State
  // TODO: We should come up with a good interface to leave state updates to the parent.
  // this leaves consumers of this widget the freedom to implement `multiple`, or `always-one-open` etc on their own.
  const selected: AccordionState = _state ?? reactive(new Set())
  const select = (item: string) => {
    if (!multiple) {
      selected.clear()
    }
    selected.add(item)
  }
  const unselect = (item: string) => {
    selected.delete(item)
  }

  const arrowNav = useArrowNavigation({
    orientation,
    loop,
  })

  const generateId = createCachedIdFn('accordion')
  const key = customName ? Symbol('accordionCustom') : accordionKey
  const api = {
    generateId,
    state: {
      selected,
      select,
      unselect,
    },
    arrowNav,
    options,
  }
  provide(key, api)

  return api
}

export const injectAccordionAPI = createInjector(
  accordionKey,
  'injectAccordionAPI()'
)

export const AccordionProps = {
  multiple: {
    type: Boolean,
    required: true,
  },
  modelValue: {
    type: Set as PropType<AccordionState>,
  },
  ...ClickableProps,
}
export const Accordion = defineComponent({
  name: 'Accordion',
  props: AccordionProps,
  setup(props, { slots }) {
    useAccordion(props as AccordionOptions, props.modelValue!)
    return () => slots.default?.()
  },
})
