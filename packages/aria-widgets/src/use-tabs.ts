import { watch } from 'vue'

import {
  useFocusGroup,
  useRovingTabIndex,
  useIdGenerator,
  createTemplateRefList,
} from 'vue-aria-composables'

export interface useTabsOptions {
  vertical?: boolean
  autoSelect?: boolean
}
export function useTabs(options: useTabsOptions = {}) {
  const { autoSelect } = options

  const { elements, refFn } = createTemplateRefList()
  const focusGroup = useFocusGroup(elements)

  const rovingTabIndex = useRovingTabIndex(elements, focusGroup.hasFocus)

  if (autoSelect) {
    watch(rovingTabIndex.index, idx => {
      elements.value[idx] && elements.value[idx].click()
    })
  }

  // Attribute generator functions
  const idGen = useIdGenerator('tabs')
  const tabAttrs = (name: string, selected: boolean) => {
    const id = idGen(name)
    return {
      role: 'tab',
      'aria-selected': selected,
      'aria-controls': id,
      'data-tab-name': name,
    }
  }
  const tabPanelAttrs = (name: string, selected: boolean) => {
    const id = idGen(name)
    return {
      role: 'tabpanel',
      id,
      hidden: selected,
      tabindex: selected ? 0 : undefined,
    }
  }

  return {
    refFn,
    ...rovingTabIndex,
    hasFocus: focusGroup.hasFocus,
    tabAttrs,
    tabPanelAttrs,
  }
}
