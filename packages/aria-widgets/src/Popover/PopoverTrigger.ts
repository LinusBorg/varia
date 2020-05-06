import { defineComponent, h, PropType, computed } from 'vue'
import { useDisclosureTrigger } from '../Disclosure'
import { ButtonProps } from '../Button'
import { injectPopoverAPI } from './usePopover'

import { ButtonOptions, PopoverAPI, PopoverAPIKey } from '../types'

export function usePopoverTrigger(props: ButtonOptions, api: PopoverAPI) {
  const disclosureAttrs = useDisclosureTrigger(props, api, api.triggerEl)

  const attributes = computed(() => ({
    ...disclosureAttrs.value,
    'aria-has-popup': 'true',
  }))

  // TODO: implement arrow key nav to Popover?

  return attributes
}

export const PopoverTrigger = defineComponent({
  name: 'PopoverTrigger',
  props: {
    ...ButtonProps,
    apiKey: {
      type: Symbol as PropType<PopoverAPIKey>,
    },
  },
  setup(props, { slots }) {
    const api = injectPopoverAPI(props.apiKey)
    const attributes = usePopoverTrigger(props, api)
    return () =>
      h(props.tag, attributes.value, slots.default?.(attributes.value))
  },
})
