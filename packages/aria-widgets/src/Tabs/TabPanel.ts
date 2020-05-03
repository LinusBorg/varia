import { computed, defineComponent, ExtractPropTypes, PropType, h } from 'vue'
import { injectTabsAPI, TabsAPIKey } from './use-tabs'

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
  hideContents: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
}

export function useTabPanel(props: TabPanelOptions) {
  const tabState = injectTabsAPI(props.tabsKey)
  const isSelected = computed(() => tabState.selectedTab.value === props.name)
  const attributes = computed(() => ({
    role: 'tabpanel' as const,
    id: tabState.generateId(props.name!),
    hidden: !isSelected.value,
    style:
      props.hideContents && !isSelected.value ? { display: 'none' } : undefined,
    tabIndex: isSelected.value ? -1 : undefined,
  }))
  return { isSelected, attributes }
}

export default defineComponent({
  name: 'TabPanel',
  props: TabPanelProps,
  setup(props, { slots }) {
    const { isSelected, attributes } = useTabPanel(props)
    return () => {
      return h(
        props.tag,
        attributes.value,
        isSelected.value &&
          !props.hideContents &&
          slots.default?.({
            isSelected: isSelected.value,
            attributes: attributes.value,
          })
      )
    }
  },
})
