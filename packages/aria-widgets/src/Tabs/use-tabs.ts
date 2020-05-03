import {
  watch,
  InjectionKey,
  inject,
  provide,
  ref,
  Ref,
  readonly,
  onMounted,
} from 'vue'
import {
  useFocusGroup,
  useRovingTabIndex,
  useIdGenerator,
  createTemplateRefAPI,
} from 'vue-aria-composables'

export interface useTabsOptions {
  initialValue: string
  orientation?: 'vertical' | 'horizontal'
  autoSelect?: boolean
  customName?: string
}

export interface TabsAPI {
  generateId: (name: string) => string
  selectedTab: Ref<string>
  select: (name: string) => void
  addElToArrowSequence: (el: HTMLElement, item: string) => void
  removeElFromArrowSequence: (el: HTMLElement) => void
  currentEl: Ref<HTMLElement | undefined>
}
export type TabsAPIKey = InjectionKey<TabsAPI>

export const _tabsAPIKey = Symbol('tabAPI') as InjectionKey<TabsAPI>

export function useTabs(options: useTabsOptions) {
  const {
    autoSelect,
    orientation = 'horizontal',
    customName,
    initialValue,
  } = options

  // Tab State
  const selectedTab = ref<string>(initialValue)
  const select = (name: string) => void (selectedTab.value = name)

  // Keyboard Navigation
  const {
    elements,
    add: addElToArrowSequence,
    remove: removeElFromArrowSequence,
    itemsToElements,
    elementsToItems,
  } = createTemplateRefAPI<string>()
  const { hasFocus, currentEl } = useFocusGroup(elements)
  const { focusByElement, index: currentTabIndex } = useRovingTabIndex(
    elements,
    hasFocus,
    {
      orientation,
    }
  )
  // When Tab Selection changes,
  // adjust the rover with the index of the
  // element matching the selected tab
  function setIndexForSelectedTab(tab: string) {
    const el = itemsToElements.get(tab)
    if (!el) return // TODO: throw proper Error /w useful message
    focusByElement(el)
  }
  watch(selectedTab, setIndexForSelectedTab)
  onMounted(() => setIndexForSelectedTab(selectedTab.value))

  if (autoSelect) {
    watch(currentTabIndex, idx => {
      const el = elements.value[idx]
      const item = el && elementsToItems.get(el)
      item && select(item)
    })
  }

  // Attribute generator functions
  const generateId = useIdGenerator(options.customName || 'tabs')

  const tabsAPIKey = customName ? Symbol('customTabAPIKey') : _tabsAPIKey
  provide(tabsAPIKey, {
    generateId,
    select,
    selectedTab: readonly(selectedTab),
    addElToArrowSequence,
    removeElFromArrowSequence,
    currentEl,
  })

  return {
    hasFocus: hasFocus,
    select,
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
