import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useEventIf } from './events'
import { getNextFocusableElement, getPreviousFocusableElement } from '../utils'
import { applyFocus } from '../utils'
import { useFocusTracker } from './focus-tracker'
import { useTabDirection } from './tab-direction'
import { TemplRefType } from '../types'

const queue = reactive<Set<Symbol>>(new Set())
const remove = (id: Symbol) => queue.delete(id)
const add = (id: Symbol) => {
  remove(id)
  queue.add(id)
}
const active = computed(() => Array.from(queue).reverse()[0])
const focusTrapQueue = Object.seal({
  active,
  add,
  remove,
})

interface FocusTrapOptions {
  activateOnMount?: boolean
}
export function useFocusTrap(options: FocusTrapOptions = {}) {
  const id = Symbol('focusGroupId')
  const activate = () => focusTrapQueue.add(id)
  const deactivate = () => focusTrapQueue.remove(id)
  const isTrapActive = computed(() => focusTrapQueue.active.value === id)
  options.activateOnMount && onMounted(activate)
  onUnmounted(deactivate)

  const wrapperEl = ref<TemplRefType>()
  const startEl = ref<TemplRefType>()
  const endEl = ref<TemplRefType>()

  const tabDirection = useTabDirection()
  const focusTracker = useFocusTracker()

  // move focus if - for whatever reason, i.e. a mouse click,
  // any element not included of the trap's elements has received focus
  useEventIf(
    isTrapActive,
    document,
    'focusin',
    ({ target }) => {
      const wrapper = wrapperEl.value
      if (!wrapper) return
      if (!wrapper.contains(target as Node)) {
        const prevEl = focusTracker.prevEl.value
        if (prevEl) {
          if (wrapperEl.value?.contains(prevEl)) {
            // if focus was moved outside of the Trap,
            // bring it back to the last element in the Trap
            applyFocus(prevEl)
          } else {
            // but if the previously focussed Element wasn't inside the FocusTrap,
            // move focus to the first element in the Trap.
            const el = getNextFocusableElement(wrapperEl.value!, startEl.value!)
            el && applyFocus(el)
          }
        }
      }
    },
    { capture: true } //TODO do we need this?
  )

  const autoMovefocus = () => {
    let el: TemplRefType
    switch (tabDirection.value) {
      case 'forward':
        el = getNextFocusableElement(wrapperEl.value!, startEl.value!)
        el && applyFocus(el)
        break
      case 'backward':
        el = getPreviousFocusableElement(wrapperEl.value!, endEl.value!)
        el && applyFocus(el)
        break
    }
  }
  // first element should never have focus
  useEventIf(isTrapActive, startEl, 'focusin', autoMovefocus)
  // last element should never have focus
  useEventIf(isTrapActive, endEl, 'focusin', autoMovefocus)

  return {
    wrapperElRef: wrapperEl,
    startElAttrs: {
      ref: (el: HTMLElement) => (startEl.value = el),
      tabindex: 0,
    },
    endElAttrs: {
      ref: (el: HTMLElement) => (endEl.value = el),
      tabindex: 0,
    },
    isActive: computed(() => isTrapActive.value),
    activate,
    deactivate,
  }
}
