import {
  createTemplateRefList,
  useFocusGroup,
  useRovingTabIndex,
  useIdGenerator,
} from 'vue-aria-composables'

interface AccordionOptions {
  orientation?: 'horizontal' | 'vertical'
}

export function useAccordion(options: AccordionOptions = {}) {
  const { elements, refFn } = createTemplateRefList()

  const focusGroup = useFocusGroup(elements)

  const rovingTabIndex = useRovingTabIndex(elements, focusGroup.hasFocus, {
    orientation: options.orientation,
  })
  const genId = useIdGenerator('accordion')
  const genHeaderAttrs = (
    name: string,
    expanded: boolean,
    disabled: boolean
  ) => {
    return {
      role: 'button',
      'aria-expanded': expanded,
      'aria-controls': genId(name),
      'aria-disabled': disabled || undefined,
    }
  }
  const genPanelAttrs = (name: string) => {
    return {
      id: genId(name),
    }
  }
  return {
    refFn,
    genHeaderAttrs,
    genPanelAttrs,
    ...rovingTabIndex,
  }
}
