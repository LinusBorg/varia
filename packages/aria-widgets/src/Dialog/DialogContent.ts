import {
  defineComponent,
  PropType,
  ref,
  getCurrentInstance,
  watch,
  nextTick,
  h,
} from 'vue'
import {
  TemplRef,
  useKeyIf,
  useClickOutside,
  getFirstFocusableChild,
} from '@varia/composables'
import { injectDialogAPI } from './useDialog'
import { useDisclosureContent } from '../Disclosure'
import { FocusTrap } from '../FocusTrap'
import { DialogAPIKey, DialogAPI, DialogContentOptions } from '../types'
import { Teleport } from '../Teleport'

const defaults: DialogContentOptions = {
  closeOnEscape: true,
  closeOnClickOutside: true,
  focusOnOpen: false,
  returnFocusOnClose: true,
}

export function useDialogContent(
  _options: Partial<DialogContentOptions> = {},
  api: DialogAPI
) {
  const options = Object.assign({}, defaults, _options)
  const vm = getCurrentInstance()
  const el: TemplRef = ref()
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

  // The following pieces of code are copied from the Popover
  // We should see if/how we can putr them in /composables
  options.closeOnEscape && useKeyIf(ref(true), ['Escape'], close)
  options.closeOnClickOutside && useClickOutside([el, triggerEl], close)

  // Focus Lifecycle
  options.focusOnOpen &&
    watch(isOpen, isOpen => {
      isOpen &&
        el.value &&
        nextTick(() => {
          const nextEl = getFirstFocusableChild(el.value!)
          nextEl && nextEl.focus()
        })
      !isOpen && options.returnFocusOnClose && triggerEl.value?.focus()
    })

  return {
    isOpen,
    close,
    attributes,
  }
}

// A lot of props are copied from `Popover`-
// no idea how to share when we move to individual packages
export const DialogContentProps = {
  tag: {
    type: String,
    default: 'DIV',
  },
  apiKey: {
    type: Symbol as PropType<DialogAPIKey>,
  },
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
}

export const DialogContent = defineComponent({
  name: 'DialogContent',
  props: DialogContentProps,
  setup(props, { slots }) {
    const api = injectDialogAPI(props.apiKey)
    const state = useDialogContent(props, api)
    return () =>
      state.isOpen.value &&
      //h(Teleport, { to: '[data-varia-teleport-dialogs]' }, [
      h(props.tag ?? 'DIV', state.attributes.value, [
        h(FocusTrap, () => slots.default?.(state)),
      ])
    //])
  },
})
