import {
  computed,
  defineComponent,
  onMounted,
  ref,
  ExtractPropTypes,
  PropType,
  h,
  watchEffect,
} from 'vue'
import { injectTabsAPI, TabsAPI, TabsAPIKey } from './use-tabs'
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

export function useTab(props: useTabOptions, api: TabsAPI) {
  const el = ref<HTMLElement>()

  onMounted(() => {
    if (el.value && !el.value?.closest('[role="tablist"]')) {
      console.warn('<Tab/> has to be nested inside of a `<TabList />`')
    }
  })

  const onClick = () => {
    !props.disabled && props.name && api.select(props.name)
  }

  const isTrulyDisabled = computed(() => props.disabled && !props.focusable)
  const isSelected = computed(() => api.selectedTab.value === props.name)
  // Link into the templateRef API for A11y
  watchEffect(() => {
    if (el.value) {
      isTrulyDisabled.value
        ? api.removeElFromArrowSequence(el.value)
        : api.addElToArrowSequence(el.value, props.name!)
    }
  })

  // Element Attributes
  const clickableAttrs = useClickable(props, el)
  const attributes = computed(() => ({
    ...clickableAttrs.value,
    role: 'tab' as const,
    'aria-selected': isSelected.value,
    'aria-controls': api.generateId(props.name!),
    tabIndex: isSelected.value ? 0 : -1,
    onClick,
  }))
  // props.name === 'B' && console.log(clickableAttrs, attributes)

  return { isSelected, attributes }
}

export default defineComponent({
  name: 'Tab',
  props: TabProps,
  setup(props, { slots }) {
    const api = injectTabsAPI(props.tabsKey)
    const { isSelected, attributes } = useTab(props, api)
    return () => {
      console.log(attributes.value)
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
