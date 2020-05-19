import {
  computed,
  defineComponent,
  onMounted,
  ref,
  ExtractPropTypes,
  PropType,
  h,
  mergeProps,
} from 'vue'
import { useArrowNavigationItem, createId } from '@varia/composables'
import { injectTabsAPI, _tabsAPIKey } from './use-tabs'
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
  const id = 'tab_' + createId()
  // api.arrowNav.addIdToNavigation(
  //   id,
  //   computed(() => !!props.disabled)
  // )
  const isSelected = computed(() => api.state.selected.value === props.name)
  const isDisabled = computed(() => !!props.disabled)

  // const hasFocus = computed(() => id === api.arrowNav.currentActiveId.value)
  const select = () => {
    !props.disabled && props.name && api.state.select(props.name)
  }

  onMounted(() => {
    el.value && isSelected.value && api.arrowNav.select(id)
    // Verify that this tab is a child of a role=tablist element
    // TODO: Should run in __DEV__ only
    if (el.value && !el.value?.closest('[role="tablist"]')) {
      console.warn('<Tab/> has to be nested inside of a `<TabList />`')
    }
  })

  // Element Attributes
  const clickableAttrs = useClickable(props, el)
  const arrrowNavAttrs = useArrowNavigationItem(
    { id, isDisabled },
    api.arrowNav
  )
  const attributes = computed(() =>
    mergeProps(clickableAttrs.value, arrrowNavAttrs.value, {
      id,
      role: 'tab' as const,
      onClick: select,
      'aria-selected': isSelected.value,
      'aria-controls': api.generateId(props.name!),
    })
  )

  return { isSelected, attributes }
}

export const Tab = defineComponent({
  name: 'Tab',
  props: TabProps,
  setup(props, { slots }) {
    const api = injectTabsAPI()
    const { isSelected, attributes } = useTab(props, api!)
    return () => {
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
