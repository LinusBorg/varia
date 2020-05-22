import { defineComponent, provide, Ref, PropType } from 'vue'
import { usePopover } from '../Popover'

import { DialogOptions, DialogAPIKey } from '../types'
import { wrapProp, createInjector } from '@varia/composables'

export const dialogAPIKey = Symbol('dialogAPI') as DialogAPIKey
export function useDialog(
  selected: Ref<boolean | undefined>,
  options: DialogOptions
) {
  const popoverAPI = usePopover(selected)

  provide(dialogAPIKey, {
    ...popoverAPI,
    options: {
      ...popoverAPI.options,
      ...options,
    },
  })

  return popoverAPI
}

export const injectDialogAPI = createInjector(dialogAPIKey, 'injectDialogAPI')

export const dialogProps = {
  modal: Boolean as PropType<boolean>,
  modelValue: Boolean as PropType<boolean>,
}

export const Dialog = defineComponent({
  name: 'Dialog',
  props: dialogProps,
  emits: ['update:modelValue'],
  setup(props, { slots }) {
    const state = wrapProp(props, 'modelValue')
    const {
      state: { selected },
    } = useDialog(state, props)
    return () => slots.default?.({ selected })
  },
})
