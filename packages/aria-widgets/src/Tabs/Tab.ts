import {
  computed,
  defineComponent,
  onMounted,
  ref,
  ExtractPropTypes,
  PropType,
  h,
} from 'vue'
import { nanoid } from 'nanoid/non-secure'
import { injectTabsAPI } from './use-tabs'
import { useClickable, ClickableProps } from '../Clickable'

import { TabsAPI, TabsAPIKey } from '../types'

export type useTabOptions = ExtractPropTypes<typeof TabProps>
export const TabProps = {
  tag: {
    type: [String, Object],
    default: 'SPAN',
  },
  name: {
    type: String,
    required: true,
  },
  tabsKey: {
    type: Symbol as PropType<TabsAPIKey>,
  },
  ...ClickableProps,
}

export function useTab(props: useTabOptions, api: TabsAPI) {
  const el = ref<HTMLElement>()
  const id = 'tab_' + nanoid()
  // const isTrulyDisabled = computed(() => props.disabled && !props.focusable)
  const isSelected = computed(() => api.selectedTab.value === props.name)
  const hasFocus = computed(() => id === api.id.value)
  const select = () => {
    !props.disabled && props.name && api.select(props.name, el.value!)
  }
  onMounted(() => {
    // TODO: should set rover tabindex if this tab isSelected on mount
    if (el.value && !el.value?.closest('[role="tablist"]')) {
      console.warn('<Tab/> has to be nested inside of a `<TabList />`')
    }
  })

  // Element Attributes
  const clickableAttrs = useClickable(props, el)
  const attributes = computed(() => ({
    ...clickableAttrs.value,
    role: 'tab' as const,
    id,
    tabindex: undefined, // reset tab index from clickable.
    onClick: select,
    'aria-selected': isSelected.value,
    'aria-controls': api.generateId(props.name!),
    'data-varia-focus': hasFocus.value ? 'true' : undefined,
  }))

  return { isSelected, attributes }
}

export default defineComponent({
  name: 'Tab',
  props: TabProps,
  setup(props, { slots }) {
    const api = injectTabsAPI(props.tabsKey)
    const { isSelected, attributes } = useTab(props, api)
    return () => {
      // console.log(attributes.value)
      return h(
        props.tag,
        attributes.value,
        slots.default?.({
          isSelected: isSelected.value,
          attributes: attributes.value,
        })
      )
    }
  },
})
