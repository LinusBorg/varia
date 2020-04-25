import { useFocusGroupOptions } from '../types'
import { Ref, watch, ref, onBeforeUnmount, computed } from 'vue'
import { useFocusTracker } from './focus-tracker'
import { applyFocus } from '../utils'
import { useKeyIf } from './keys'

export function useReturnBehaviour(
  isActive: Ref<boolean>,
  options: useFocusGroupOptions = {}
) {
  const returnEl = ref<HTMLElement>()

  const { prevEl } = useFocusTracker()
  watch(isActive, (newVal, oldVal) => {
    if (newVal && !oldVal) {
      returnEl.value = prevEl.value
    }
  })

  function returnFocus() {
    if (!isActive.value) return
    const el = returnEl.value
    el && applyFocus(el)
  }

  if (options.returnOnUnmount) {
    onBeforeUnmount(returnFocus)
  }
  if (options.returnOnEscape) {
    useKeyIf(isActive, ['Esc'], (() => {
      returnFocus()
    }) as EventListener)
  }

  return {
    returnEl: computed(() => returnEl.value),
    returnFocus,
  }
}
