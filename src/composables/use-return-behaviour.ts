import { useFocusGroupOptions } from '../types'
import {
  Ref,
  watch,
  ref,
  onBeforeUnmount,
  computed,
} from '@vue/composition-api'
import { useGlobalFocusTracker } from './use-global-focustracker'
import { applyFocus } from '~/utils'
import { useKeyIf } from './use-events'

export function useReturnBehaviour(
  isActive: Ref<boolean>,
  options: useFocusGroupOptions = {}
) {
  const returnEl = ref<HTMLElement>(null)

  const { prevEl } = useGlobalFocusTracker()
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
    useKeyIf(isActive, ['Esc'], ((e: KeyboardEvent) => {
      returnFocus()
    }) as EventHandlerNonNull)
  }

  return {
    returnEl: computed(() => returnEl.value),
    returnFocus,
  }
}
