import { watch, InjectionKey, provide, ref, Ref } from 'vue'

import {
  useFocusGroup,
  useRovingTabIndex,
  useIdGenerator,
  createTemplateRefProvider,
} from 'vue-aria-composables'

export interface useTabsOptions {
  orientation?: 'vertical' | 'horizontal'
  autoSelect?: boolean
}

export interface TabAPI {
  generateId: (name: string) => string
  select: (name: string) => void
  activeTab: Ref<string>
  generateTabAttrs: typeof generateTabAttrs
  generateTabPanelAttrs: typeof generateTabPanelAttrs
}

import { TemplateRefKey } from 'vue-aria-composables'

export const tabListMarker = Symbol('tabListMarker')
export const tabElementsKey = Symbol('tabElements') as TemplateRefKey
export const tabAPIKey = Symbol('tabAPI') as InjectionKey<TabAPI>

const generateTabAttrs = (id: string, selected: boolean) => {
  return {
    role: 'tab' as const,
    'aria-selected': selected,
    'aria-controls': id,
    'data-tab-name': name,
  }
}
const generateTabPanelAttrs = (id: string, selected: boolean) => {
  return {
    role: 'tabpanel' as const,
    id,
    hidden: selected,
    tabindex: selected ? 0 : undefined,
  }
}

export function useTabs(options: useTabsOptions = {}) {
  const { autoSelect, orientation = 'horizontal' } = options

  // Keyboard Navigation
  const { elements, refFn } = createTemplateRefProvider(tabElementsKey)
  const focusGroup = useFocusGroup(elements)
  const rovingTabIndex = useRovingTabIndex(elements, focusGroup.hasFocus, {
    orientation,
  })

  if (autoSelect) {
    watch(rovingTabIndex.index, idx => {
      elements.value[idx] && elements.value[idx].click()
    })
  }

  // Tab State
  const activeTab = ref<string>('')
  const select = (name: string) => void (activeTab.value = name)

  // Attribute generator functions
  const generateId = useIdGenerator('tabs')

  provide(tabAPIKey, {
    generateId,
    select,
    activeTab,
    generateTabAttrs,
    generateTabPanelAttrs,
  })

  return {
    refFn,
    ...rovingTabIndex,
    hasFocus: focusGroup.hasFocus,
    select,
    generateId,
    generateTabAttrs,
    generateTabPanelAttrs,
  }
}
