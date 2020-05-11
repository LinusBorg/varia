import { defineComponent, h, PropType } from 'vue'
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
    const { wrapperAttributes: attributes } = api.arrowNav
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
