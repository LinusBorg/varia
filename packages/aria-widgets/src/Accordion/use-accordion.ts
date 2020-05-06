import { inject, InjectionKey, provide, reactive, Ref } from 'vue'
import {
  createTemplateRefList,
  useFocusGroup,
  useRovingTabIndex,
  useIdGenerator,
} from 'vue-aria-composables'

interface AccordionOptions {
  multiple?: boolean
  orientation?: 'horizontal' | 'vertical'
  customName?: string
}

export type AccordionState = Record<string, boolean>

export interface AccordionAPI {
  genHeaderAttrs: typeof genHeaderAttrs
  genPanelAttrs: typeof genPanelAttrs
  generateId: (n: string) => string
  set: (name: string, isActive: boolean) => void
  state: AccordionState
}

export type AccordionKey = InjectionKey<AccordionAPI>

export const accordionKey = Symbol('disclosure') as AccordionKey

const genHeaderAttrs = (id: string, expanded: boolean, disabled: boolean) => {
  return {
    'aria-expanded': expanded,
    'aria-controls': id,
    'aria-disabled': disabled || undefined,
  }
}

const genPanelAttrs = (id: string) => {
  return {
    id: id,
  }
}
export function useAccordion(options: AccordionOptions = {}) {
  //Accordion State
  const state = reactive<AccordionState>({})
  const set = (name: string, isActive: boolean) => {
    if (!options.multiple) {
      Object.keys(state).forEach((key: string) => void (state[key] = false))
    }
    state[name] = isActive
  }
  // A11y: Keyboard Control
  const { elements, refFn } = createTemplateRefList()
  const focusGroup = useFocusGroup(elements)
  const rovingTabIndex = useRovingTabIndex(elements, focusGroup.hasFocus, {
    orientation: options.orientation,
  })
  const generateId = useIdGenerator('accordion')
  const key = options.customName ? Symbol('accordionCustom') : accordionKey
  provide(key, {
    genHeaderAttrs,
    generateId,
    genPanelAttrs,
    set,
    state,
  })

  return {
    refFn,
    genHeaderAttrs,
    genPanelAttrs,
    ...rovingTabIndex,
  }
}

export function useAccordionInjection(key: AccordionKey = accordionKey) {
  return inject(key)
}
