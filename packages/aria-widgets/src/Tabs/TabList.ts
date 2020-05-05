import { defineComponent, h, PropType } from 'vue'
import { injectTabsAPI } from './use-tabs'

import { TabsAPIKey } from '../types'

export default defineComponent({
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
    const { tabListAttributes: attributes, tabListRef: ref } = injectTabsAPI(
      props.tabsKey
    )
    return () =>
      h(
        props.tag,
        {
          role: 'tablist',
          ref,
          ...attributes.value,
        },
        slots.default?.()
      )
  },
})
