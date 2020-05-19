import { defineComponent, h, PropType } from 'vue'
import { useArrowNavWrapper } from '@varia/composables'
import { injectTabsAPI } from './use-tabs'

import { TabsAPIKey } from '../types'

export const TabList = defineComponent({
  name: 'TabList',
  props: {
    tag: {
      type: String,
      default: 'DIV',
    },
    tabsKey: {
      type: Symbol as PropType<TabsAPIKey>,
    },
  },
  setup(props, { slots }) {
    const api = injectTabsAPI(props.tabsKey)
    const attributes = useArrowNavWrapper(api.arrowNav)
    return () =>
      h(
        props.tag,
        {
          role: 'tablist',
          ...attributes.value,
        },
        slots.default?.()
      )
  },
})
