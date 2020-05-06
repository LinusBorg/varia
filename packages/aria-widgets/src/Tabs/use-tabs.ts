import { InjectionKey, inject, provide, ref, readonly } from 'vue'
import {
  useIdGenerator,
  useArrowNavigation,
  TemplRef,
} from 'vue-aria-composables'
import './index.css'

import { TabsOptions, TabsAPI, TabsAPIKey } from '../types'

export const _tabsAPIKey = Symbol('tabAPI') as InjectionKey<TabsAPI>

export function useTabs<States extends string | number>(
  options: TabsOptions<States>
) {
  const {
    initialValue,
    customName,
    // Options for ArrowNavigation
    orientation = 'horizontal',
    loop,
    startOnFirstSelected,
    autoSelect = false,
  } = options

  // Keyboard Navigation
  const el: TemplRef = ref()
  const arrowNavAPI = useArrowNavigation(el, {
    orientation,
    loop,
    autoSelect,
    startOnFirstSelected,
  })

  // Tab State
  const selectedTab = ref<string | number>(initialValue)
  const select = (name: string, el: HTMLElement) => {
    selectedTab.value = name
    arrowNavAPI.select(el)
  }

  // Attribute generator functions
  const generateId = useIdGenerator(options.customName || 'tabs')

  const tabsAPIKey = customName ? Symbol('customTabAPIKey') : _tabsAPIKey
  provide(tabsAPIKey, {
    generateId,
    select,
    selectedTab: readonly(selectedTab),
    autoSelect,
    arrowNavAPI,
  })

  return {
    select,
    id: arrowNavAPI.currentActiveId,
    generateId,
    tabsKey: tabsAPIKey,
    selectedTab: readonly(selectedTab),
  }
}

export function injectTabsAPI(key: TabsAPIKey = _tabsAPIKey) {
  const api = inject(key)
  if (!api) {
    console.warn('<Tab />: useTabs() was not called in parent component')
    throw new Error('Missing TabsAPI Injection from parent component')
  }
  return api
}
