import { Ref, watch } from 'vue'

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
export function useTabs(
  selectedName: Ref<string>,
  options: useTabsOptions = {}
) {
  const { autoSelect } = options

  const { elements, refFn } = createTemplateRefList()
  const focusGroup = useFocusGroup(elements)

  const rovingTabIndex = useRovingTabIndex(elements, focusGroup.isActive)

  if (autoSelect) {
    watch(rovingTabIndex.index, idx => {
      elements.value[idx] && elements.value[idx].click()
    })
  }

  // Attribute generator functions
  const idGen = useIdGenerator('tabs')
  const tabAttrs = (name: string) => {
    const id = idGen(name)
    return {
      role: 'tab',
      'aria-selected': name === selectedName.value,
      'aria-controls': id,
      'data-tab-name': name,
    }
  }
  const tabPanelAttrs = (name: string) => {
    const id = idGen(name)
    return {
      role: 'tabpanel',
      id,
      hidden: name !== selectedName.value,
      tabindex: name == selectedName.value ? 0 : undefined,
    }
  }

  return {
    refFn,
    ...rovingTabIndex,
    hasFocus: focusGroup.isActive,
    tabAttrs,
    tabPanelAttrs,
  }
}
