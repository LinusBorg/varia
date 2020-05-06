import { computed } from 'vue'
import { useFocusTracker } from './focus-tracker'
import { TemplRef } from '../types'

export function useElementFocusObserver(el: TemplRef) {
  const tracker = useFocusTracker()
  const hasFocus = computed(
    () => !!el.value && tracker.currentEl.value === el.value
  )
  return {
    hasFocus,
  }
}
