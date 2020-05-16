import { defineComponent, PropType, h } from 'vue'
import { injectDialogAPI } from './useDialog'
import { useDisclosureTrigger } from '../Disclosure'
import { DialogAPIKey, DialogAPI } from '../types'

interface DialogOptions {}

export function useDialogTrigger(options: DialogOptions = {}, api: DialogAPI) {
  const el = api.elements.triggerEl
  const attributes = useDisclosureTrigger(options, api, el)

  return attributes
}

export const dialogTriggerProps = {
  tag: {
    type: String,
  },
  apiKey: {
    type: Symbol as PropType<DialogAPIKey>,
  },
}

export const DialogTrigger = defineComponent({
  name: 'DialogTrigger',
  props: dialogTriggerProps,
  setup(props, { slots }) {
    const api = injectDialogAPI(props.apiKey)
    const attributes = useDialogTrigger(props, api)
    return () => h(props.tag ?? 'button', attributes.value, slots.default?.())
  },
})
