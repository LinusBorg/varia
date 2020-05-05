import { Ref, computed } from 'vue'
import { useFocusTracker } from './focus-tracker'

export function useElementFocusObserver(el: Ref<HTMLElement | undefined>) {
  const tracker = useFocusTracker()
  const hasFocus = computed(
    () => !!el.value && tracker.currentEl.value === el.value
  )
  return hasFocus
}
