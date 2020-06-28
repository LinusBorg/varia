import { ref, provide, inject, computed, InjectionKey, readonly } from 'vue'
import { useEvent } from '../composables/events'

import { FocusTrackerAPI } from '../types'

export const focusTrackerKey: InjectionKey<FocusTrackerAPI> = Symbol(
  'globalFocusTracker'
)

// all elements that are not claimed by an explicit FocusGroup
// are part of the global FocusGroup

const prevEl = ref<HTMLElement>()
const activeEl = ref<HTMLElement>(document.activeElement as HTMLElement)
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

export const focusTracker = {
  // State
  prevEl: readonly(prevEl),
  activeEl: readonly(activeEl),
  currentEl: computed(() => (docHasFocus.value ? activeEl.value : undefined)),
}
