import {
  computed,
  readonly,
  reactive,
  Ref,
  ref,
  watch,
  onMounted,
  onUnmounted,
  defineComponent,
  h,
  PropType,
  toRaw,
} from 'vue'
import {
  applyFocus,
  getFocusableElements,
  TABBABLE_ELS,
  focusTracker,
  tabDirection,
  TemplRef,
  TemplRefType,
  useEventIf,
  wrapProp,
} from '@varia/composables'

// import { useInert } from './inert'

import { FocusTrapOptions } from '../types'

// only one FocusTrap can be active at a time.
// So we track a Queue of all active FocusTraps,
const queue = reactive<Set<Symbol>>(new Set())
const remove = (id: Symbol) => queue.delete(id)
const add = (id: Symbol) => {
  remove(id)
  queue.add(id)
}
const active = computed(() => Array.from(queue).reverse()[0])
const focusTrapQueue = readonly({
  active,
  add,
  remove,
})

function getNextFocusElement(
  el1: HTMLElement,
  el2: HTMLElement,
  direction: 'forward' | 'backward'
) {
  const property =
    direction === 'backward' ? 'previousElementSibling' : 'nextElementSibling'
  const startEl = direction === 'backward' ? el2 : el1
  const endEl = direction === 'backward' ? el1 : el2

  let nextSibling: Element | null = startEl[property]

  while (nextSibling && nextSibling !== endEl) {
    // if sibling is focusable, return it
    if (nextSibling.matches(TABBABLE_ELS)) return nextSibling as HTMLElement
    // else, loof for focusable descendants
    const els = getFocusableElements(nextSibling as HTMLElement)
    const idx = direction === 'backward' ? els.length - 1 : 0
    // if a descendant is focusable, return it
    if (els[idx]) return els[idx]
    // else, go to next Sibling
    nextSibling = nextSibling[property]
  }
  return undefined
}

function isBetween<El extends Element = HTMLElement>(el: El, el1: El, el2: El) {
  return (
    el.compareDocumentPosition(el2) & Node.DOCUMENT_POSITION_FOLLOWING &&
    el.compareDocumentPosition(el1) & Node.DOCUMENT_POSITION_PRECEDING
  )
}

const defaultOptions = {
  activateOnMount: true,
}
export function useFocusTrap(
  state: Ref<boolean | undefined>,
  _options: FocusTrapOptions = defaultOptions
) {
  const options = Object.assign({}, defaultOptions, _options)

  const startEl: TemplRef = ref()
  const endEl: TemplRef = ref()

  const id = Symbol('focusGroupId')
  const activate = () => {
    focusTrapQueue.add(id)
    !state.value && (state.value = true)
  }
  const deactivate = () => {
    focusTrapQueue.remove(id)
    state.value && (state.value = false)
  }
  const isActiveTrap = computed(() => toRaw(focusTrapQueue.active) === id)
  watch(state, state => {
    state ? activate() : deactivate()
  })

  // options.useInert && useInert(wrapperEl, isActiveTrap)

  // Mount/Unmount
  options.activateOnMount && onMounted(activate)
  onUnmounted(deactivate)

  const autoMovefocus = (defaultDirection: 'forward' | 'backward') => {
    console.log('autofucs()', tabDirection.value)
    let el: TemplRefType
    switch (tabDirection.value) {
      case 'forward':
        // if (skip === 'forward') return
        el = getNextFocusElement(startEl.value!, endEl.value!, 'forward')
        el && el.focus()
        break
      case 'backward':
        // if (skip === 'backward') return
        el = getNextFocusElement(startEl.value!, endEl.value!, 'backward')
        el && el.focus()
        break
      case undefined:
        el = getNextFocusElement(startEl.value!, endEl.value!, defaultDirection)
        el && el.focus()
        break
    }
  }
  // first element should never have focus
  useEventIf(isActiveTrap, startEl, 'focus', () => autoMovefocus('forward'))
  // last element should never have focus
  useEventIf(isActiveTrap, endEl, 'focus', () => autoMovefocus('backward'))

  // move focus if - for whatever reason, i.e. a mouse click,
  // any element not included of the trap's elements has received focus
  useEventIf(isActiveTrap, document, 'focusin', ({ target }) => {
    if (target === startEl.value || target === endEl.value) return
    if (isBetween(target as HTMLElement, startEl.value!, endEl.value!)) return
    const prevEl = focusTracker.prevEl.value
    if (prevEl) {
      if (isBetween(prevEl, startEl.value!, endEl.value!)) {
        // if focus was moved outside of the Trap,
        // bring it back to the last element in the Trap
        applyFocus(prevEl)
      } else {
        // but if the previously focussed Element wasn't inside the FocusTrap,
        // move focus to the first element in the Trap.
        startEl.value!.focus()
      }
    }
  })

  return {
    startElAttrs: computed(() => ({
      ref: startEl,
      'data-varia-visually-hidden': true,
      'data-varia-focustrap-start': true,
      tabindex: isActiveTrap.value ? 0 : undefined,
    })),
    endElAttrs: computed(() => ({
      'data-varia-visually-hidden': true,
      'data-varia-focustrap-end': true,
      ref: endEl,
      tabindex: isActiveTrap.value ? 0 : undefined,
    })),
    isActive: isActiveTrap,
    activate,
    deactivate,
  }
}

const focusTrapProps = {
  tag: String,
  activateOnMount: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  modelValue: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
  useInert: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
}

export const FocusTrap = defineComponent({
  name: 'FocusTrap',
  props: focusTrapProps,
  inheritAttrs: false,
  setup(props, { slots }) {
    const state = wrapProp(props, 'modelValue')
    const focusTrap = useFocusTrap(state, props)
    return () => {
      return [
        h('SPAN', focusTrap.startElAttrs.value),
        ...(slots.default?.() || []),
        h('SPAN', focusTrap.endElAttrs.value),
      ]
    }
  },
})
