import {
  computed,
  defineComponent,
  inject,
  ref,
  ExtractPropTypes,
  h,
} from 'vue'
import { tabAPIKey } from './use-tabs'
import { TabProps } from './Tab'
import { elsKey } from 'packages/aria-widgets/dist/ListBox/use-listbox'

export type TabPanelOptions = ExtractPropTypes<typeof TabProps>

export const TabPanelProps = {
  tag: {
    type: String,
    default: 'DIV',
  },
  name: {
    type: String,
    required: true,
  },
}
const generateTabPanelAttrs = (id: string, selected: boolean) => {
  return {
    role: 'tabpanel' as const,
    id,
    hidden: selected,
    tabindex: selected ? 0 : undefined,
  }
}

export function useTabPanel(options: TabPanelOptions) {
  const tabState = inject(tabAPIKey)
  if (!tabState) {
    throw new Error('Missing TabsAPI Injection from parent component')
  }
  const id = computed(() => tabState.generateId(options.name!))
  const isActive = computed(() => tabState.activeTab.value === options.name)
  const attributes = computed(() =>
    generateTabPanelAttrs(id.value, isActive.value)
  )
  return { isActive, attributes }
}

export default defineComponent({
  name: 'TabPanel',
  props: TabPanelProps,
  setup(props, { slots }) {
    const { isActive, attributes } = useTabPanel(props)
    return () => {
      return h(
        props.tag,
        attributes.value,
        isActive.value && slots.default?.(attributes.value)
      )
    }
  },
})
