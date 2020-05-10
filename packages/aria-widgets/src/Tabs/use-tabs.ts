import {
  InjectionKey,
  inject,
  provide,
  ref,
  readonly,
  defineComponent,
  h,
  PropType,
  Ref,
} from 'vue'
import {
  useIdGenerator,
  useArrowNavigation,
  TemplRef,
  wrapProp,
} from 'vue-aria-composables'
import './index.css'
import { omit } from '../utils/pick'

import { TabsOptions, TabsAPI } from '../types'
import { createInjector } from '../utils/inject'

export const _tabsAPIKey = Symbol('tabAPI') as InjectionKey<TabsAPI>

export function useTabs(_state: Ref<string | undefined>, options: TabsOptions) {
  const {
    customName,
    // Options for ArrowNavigation
    orientation = 'horizontal',
    loop,
    startOnFirstSelected,
    autoSelect = false,
    virtual = false,
  } = options

  // Tab State
  const selectedTab = _state
  const select = (name: string) => {
    selectedTab.value = name
  }

  // Keyboard Navigation
  const el: TemplRef = ref()
  const arrowNav = useArrowNavigation(
    {
      orientation,
      loop,
      autoSelect,
      startOnFirstSelected,
      virtual,
    },
    el
  )

  // API
  const tabsAPI = {
    generateId: useIdGenerator(options.customName || 'tabs'),
    state: {
      select,
      selected: readonly(selectedTab),
    },
    arrowNav,
    options,
  }
  const tabsAPIKey = customName ? Symbol('customTabAPIKey') : _tabsAPIKey
  provide(tabsAPIKey, tabsAPI)

  return {
    ...tabsAPI,
    tabsKey: tabsAPIKey,
  }
}

export const injectTabsAPI = createInjector(_tabsAPIKey, `injectTabsAPI()`)

export const tabsProps = {
  tag: {
    type: String,
    default: 'DIV',
  },
  modelValue: {
    type: String,
    required: true,
  },
  orientation: String as PropType<'horizontal' | 'vertical'>,
  loop: Boolean as PropType<boolean>,
  startOnFirstSelected: Boolean as PropType<boolean>,
  autoSelect: Boolean as PropType<boolean>,
  virtual: Boolean as PropType<boolean>,
}

export const Tabs = defineComponent({
  name: 'Tabs',
  props: tabsProps,
  setup(props, { slots }) {
    const state = wrapProp(props, 'modelValue')
    useTabs(state, omit(props, ['tag', 'modelValue']))
    return () => h(props.tag, slots.default?.())
  },
})
