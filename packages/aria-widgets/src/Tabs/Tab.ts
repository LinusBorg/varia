import {
  computed,
  defineComponent,
  inject,
  onMounted,
  ref,
  ExtractPropTypes,
  h,
} from 'vue'
import { tabElementsKey, tabAPIKey } from './use-tabs'
import { useParentElementInjection } from 'vue-aria-composables'
import { useClickable, ClickableProps } from '../Clickable'

export type useTabOptions = ExtractPropTypes<typeof TabProps>
export const TabProps = {
  tag: {
    type: [String, Object],
    default: 'DIV',
  },
  name: {
    type: String,
    required: true,
  },
  ...ClickableProps,
}

const generateTabAttrs = (id: string, selected: boolean) => {
  return {
    role: 'tab' as const,
    'aria-selected': selected,
    'aria-controls': id,
    'data-tab-name': name,
  }
}

export function useTab(props: useTabOptions) {
  const el = ref<HTMLElement>()

  onMounted(() => {
    if (el.value && !el.value?.closest('[role="tablist"]')) {
      console.warn('<Tab/> has to be nested inside of a `<TabList />`')
    }
  })

  // Inject Tabs API
  const tabState = inject(tabAPIKey)
  if (!tabState) {
    console.warn('<Tab />: useTabs() was not called in parent component')
    throw new Error('Missing TabsAPI Injection from parent component')
  }
  const onClick = () => {
    props.name && tabState?.select(props.name)
  }
  const isActiveTab = computed(() => tabState.activeTab.value === props.name)

  // A11y
  const id = computed(() => tabState.generateId(props.name!))
  const tabEls = useParentElementInjection(el, tabElementsKey)

  // Element Attributes
  const clickableAttrs = useClickable(props, el)
  const attributes = computed(() => ({
    ...clickableAttrs.value,
    ...generateTabAttrs(id.value, isActiveTab.value),
    onClick,
  }))

  return attributes
}

export default defineComponent({
  name: 'Tab',
  props: TabProps,
  setup(props, { slots }) {
    const attributes = useTab(props)
    return () => {
      h(props.tag, attributes.value, slots.default?.(attributes))
    }
  },
})
