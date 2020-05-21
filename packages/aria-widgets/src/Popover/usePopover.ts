import { Ref, provide, ref, defineComponent, PropType } from 'vue'
import { useDisclosure } from '../Disclosure'
import { PopoverAPIKey } from '../types'
import { TemplRef, wrapProp } from '@varia/composables'
import { createInjector } from '../utils/inject'

export const popoverAPIKey = Symbol('popoverAPI') as PopoverAPIKey

function _usePopover(state: Ref<boolean | undefined>) {
  const triggerEl: TemplRef = ref()
  const contentEl: TemplRef = ref()

  const disclosureAPI = useDisclosure(state)

  const api = {
    ...disclosureAPI,
    elements: {
      triggerEl,
      contentEl,
    },
  }

  return api
}

export const usePopover = Object.assign(_usePopover, {
  withProvide(selected: Ref<boolean | undefined>) {
    const api = _usePopover(selected)
    provide(popoverAPIKey, api)
    return api
  },
})

export const injectPopoverAPI = createInjector(
  popoverAPIKey,
  `injectPopoverAPI()`
)

export const popoverProps = {
  modelValue: Boolean as PropType<boolean>,
}

export const Popover = defineComponent({
  name: 'Popover',
  props: popoverProps,
  emits: ['update:modelValue'],
  setup(props, { slots }) {
    const state = wrapProp(props, 'modelValue')
    usePopover.withProvide(state)
    return () => slots.default?.()
  },
})
