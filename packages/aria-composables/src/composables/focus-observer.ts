import { computed, Ref } from 'vue'
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

export function useSelectorFocusObserver(selector: Ref<string>) {
  const tracker = useFocusTracker()
  const hasFocus = computed(() => {
    if (selector.value.length === 0) return false
    return !!tracker.currentEl.value?.matches(selector.value)
  })
  return {
    hasFocus,
  }
}
