import { computed, Ref } from 'vue'
import { focusTracker } from '../helpers'
import { TemplRef } from '../types'

export function useElementFocusObserver(el: TemplRef) {
  const hasFocus = computed(
    () => !!el.value && focusTracker.currentEl.value === el.value
  )
  return {
    hasFocus,
  }
}

export function useSelectorFocusObserver(selector: Ref<string>) {
  const hasFocus = computed(() => {
    if (selector.value.length === 0) return false
    return !!focusTracker.currentEl.value?.matches(selector.value)
  })
  return {
    hasFocus,
  }
}
