import {
  InjectionKey,
  provide,
  ref,
  readonly,
  defineComponent,
  h,
  PropType,
  Ref,
  reactive,
} from 'vue'
import {
  createCachedIdFn,
  useArrowNavigation,
  TemplRef,
  wrapProp,
  useReactiveDefaults,
} from '@varia/composables'
import './index.css'
import { omit } from '../utils/pick'

import { TabsOptions, TabsAPI } from '../types'
import { createInjector } from '../utils/inject'

export const _tabsAPIKey = Symbol('tabAPI') as InjectionKey<TabsAPI>

const defaultOptions: TabsOptions = {
  customName: undefined,
  // Options for ArrowNavigation
  orientation: 'horizontal',
  loop: true,
  startOnFirstSelected: true,
  autoSelect: false,
  virtual: false,
}

export function useTabs(_state: Ref<string>, options: Partial<TabsOptions>) {
  const {
    customName,
    // Options for ArrowNavigation
    orientation,
    loop,
    startOnFirstSelected,
    autoSelect,
    virtual,
  } = useReactiveDefaults(options, defaultOptions)

  // Tab State
  const selectedTab = _state
  const select = (name: string) => {
    selectedTab.value = name
  }

  // Keyboard Navigation
  const el: TemplRef = ref()
  const arrowNav = useArrowNavigation(
    reactive({
      orientation,
      loop,
      autoSelect,
      startOnFirstSelected,
      virtual,
    }),
    el
  )

  // API
  const tabsAPI = {
    generateId: createCachedIdFn(options.customName || 'tabs'),
    state: {
      select,
      selected: readonly(selectedTab),
    },
    arrowNav,
    options: reactive({
      customName,
      orientation,
      loop,
      startOnFirstSelected,
      autoSelect,
      virtual,
    }),
  }
  const tabsAPIKey =
    customName && customName.value ? Symbol('customTabAPIKey') : _tabsAPIKey
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
    default: '',
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
    useTabs(state, props)
    return () => h(props.tag, slots.default?.())
  },
})
