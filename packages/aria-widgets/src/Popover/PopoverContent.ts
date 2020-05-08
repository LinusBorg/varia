import {
  defineComponent,
  h,
  getCurrentInstance,
  ref,
  PropType,
  watch,
  watchEffect,
  nextTick,
  reactive,
} from 'vue'
import {
  useKeyIf,
  useClickOutside,
  moveFocusToNextElement,
} from 'vue-aria-composables'
import { useDisclosureContent } from '../Disclosure'
import { injectPopoverAPI } from './usePopover'
import {
  createPopper,
  Options as PopperOptions,
  Instance as PopperInstance,
} from '@popperjs/core'

import { PopoverContentOptions, PopoverAPIKey, PopoverAPI } from '../types'

export const PopoverContentProps = {
  tag: {
    type: String,
    default: 'DIV',
  },
  apiKey: {
    type: Symbol as PropType<PopoverAPIKey>,
  },
  closeOnBlur: { type: Boolean as PropType<boolean>, default: true },
  closeOnEscape: { type: Boolean as PropType<boolean>, default: true },
  closeOnClickOutside: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  focusOnOpen: {
    type: Boolean as PropType<boolean>,
  },
  returnFocusOnClose: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  popperOptions: {
    type: Object as PropType<PopperOptions>,
  },
}

const defaults: PopoverContentOptions = {
  closeOnBlur: true,
  closeOnEscape: true,
  closeOnClickOutside: true,
  focusOnOpen: false,
  returnFocusOnClose: true,
}

export function usePopoverContent(
  _options: Partial<PopoverContentOptions> = {},
  api: PopoverAPI
) {
  const options = Object.assign({}, defaults, _options)
  const vm = getCurrentInstance()

  const el = ref<HTMLElement | undefined>()
  const { attributes } = useDisclosureContent(api, el)
  const {
    state: { selected: isOpen },
    elements: { triggerEl },
  } = api

  // Closing Behaviours
  const close = () => {
    vm && vm.emit('closed')
    isOpen.value = false
  }
  options.closeOnEscape && useKeyIf(ref(true), ['Escape'], close)
  options.closeOnClickOutside && useClickOutside([el, triggerEl], close)

  // Focus Lifecycle
  options.focusOnOpen &&
    watch(isOpen, isOpen => {
      isOpen && el.value && nextTick(() => moveFocusToNextElement(el.value!))
      !isOpen && options.returnFocusOnClose && triggerEl.value?.focus()
    })

  // Positioning the Popover using Popper.js
  let popperInstance: PopperInstance
  watchEffect(onCleanup => {
    if (isOpen.value && el.value && triggerEl.value) {
      popperInstance = createPopper(
        triggerEl.value,
        el.value,
        options.popperOptions
      )
      // TODO: Do we need this?
      nextTick(() => popperInstance?.forceUpdate())
    }
    onCleanup(() => {
      if (!isOpen.value && popperInstance) popperInstance.destroy()
    })
  })

  // const update = () => popperInstance?.update()
  // const forceUpdate = () => popperInstance?.forceUpdate()
  // const destroy = () => popperInstance?.destroy()
  return {
    isOpen,
    close,
    attributes,
    focusFirstElement: () => el.value && moveFocusToNextElement(el.value),
    // update,
    // forceUpdate,
    // destroy,
  }
}

export const PopoverContent = defineComponent({
  name: 'PopoverContent',
  props: PopoverContentProps,
  setup(props, { slots }) {
    const api = injectPopoverAPI(props.apiKey)
    const state = usePopoverContent(props, api)
    return () =>
      state.isOpen.value
        ? h(props.tag, state.attributes.value, slots.default?.(reactive(state)))
        : null
  },
})
