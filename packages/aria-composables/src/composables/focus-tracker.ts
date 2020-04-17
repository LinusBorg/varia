import { ref, provide, inject, computed, InjectionKey } from 'vue'
import { useEvent } from './events'

import { FocusTrackerState } from '../types'

export const focusTrackerKey: InjectionKey<FocusTrackerState> = Symbol(
  'globalFocusTracker'
)

// all elements that are not claimed by an explicit FocusGroup
// are part of the global FocusGroup

const prevEl = ref<HTMLElement | null>(null)
const activeEl = ref<HTMLElement | null>(document.activeElement as HTMLElement)
const docHasFocus = ref<boolean>(document.hasFocus())
// when a FocusGroup takes over focus management,
// it notifies the tracker by calling this function

useEvent(document, 'focusin', e => {
  docHasFocus.value = true
  prevEl.value = activeEl.value
  activeEl.value = e.target as HTMLElement
})

useEvent(document, 'focusout', () => {
  setTimeout(() => {
    docHasFocus.value = document.hasFocus()
  }, 0)
})
export const state = {
  // State
  prevEl: computed(() => prevEl.value),
  activeEl: computed(() => activeEl.value),
  currentEl: computed(() => (docHasFocus.value ? activeEl.value : null)),
}

export function provideFocusTracker() {
  provide(focusTrackerKey, state)
}

export function useFocusTracker() {
  return inject(focusTrackerKey) as FocusTrackerState
}
