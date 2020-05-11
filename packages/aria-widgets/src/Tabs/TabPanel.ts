import { computed, defineComponent, ExtractPropTypes, PropType, h } from 'vue'
import { injectTabsAPI } from './use-tabs'

import { TabsAPI, TabsAPIKey } from '../types'

export type TabPanelOptions = ExtractPropTypes<typeof TabPanelProps>

export const TabPanelProps = {
  tag: {
    type: String,
    default: 'DIV',
  },
  name: {
    type: String,
    required: true,
  },
  tabsKey: {
    type: Symbol as PropType<TabsAPIKey>,
  },
}

export function useTabPanel(props: TabPanelOptions, api: TabsAPI) {
  const isSelected = computed(() => api.state.selected.value === props.name)
  const attributes = computed(() => ({
    role: 'tabpanel' as const,
    id: api.generateId(props.name!),
    hidden: !isSelected.value,
    tabindex: isSelected.value ? -1 : undefined,
  }))
  return { isSelected, attributes }
}

export const TabPanel = defineComponent({
  name: 'TabPanel',
  props: TabPanelProps,
  setup(props, { slots }) {
    const api = injectTabsAPI(props.tabsKey)
    const { isSelected, attributes } = useTabPanel(props, api)
    return () => {
      return (
        isSelected.value &&
        h(
          props.tag,
          attributes.value,
          slots.default?.({
            isSelected: isSelected.value,
            attributes: attributes.value,
          })
        )
      )
    }
  },
})
