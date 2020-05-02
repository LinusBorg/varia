import {
  computed,
  defineComponent,
  onMounted,
  ref,
  ExtractPropTypes,
  PropType,
  h,
} from 'vue'
import { injectTabsAPI, TabsAPIKey } from './use-tabs'
import { useClickable, ClickableProps } from '../Clickable'

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

export function useTab(props: useTabOptions) {
  const el = ref<HTMLElement>()

  onMounted(() => {
    if (el.value && !el.value?.closest('[role="tablist"]')) {
      console.warn('<Tab/> has to be nested inside of a `<TabList />`')
    }
  })

  // Inject Tabs API
  const tabsAPI = injectTabsAPI(props.tabsKey)

  const onClick = () => {
    props.name && tabsAPI?.select(props.name)
  }
  const isSelected = computed(() => tabsAPI.selectedTab.value === props.name)

  // Link into the templateRef API for A11y
  tabsAPI.addMapping(el, props.name!) // watch this element for Keyboard access

  // Element Attributes
  const clickableAttrs = useClickable(props, el)
  const attributes = computed(() => ({
    ...clickableAttrs.value,
    role: 'tab' as const,
    'aria-selected': isSelected.value,
    'aria-controls': tabsAPI.generateId(props.name!),
    onClick,
  }))

  return { isSelected, attributes }
}

export default defineComponent({
  name: 'Tab',
  props: TabProps,
  setup(props, { slots }) {
    const { isSelected, attributes } = useTab(props)
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
