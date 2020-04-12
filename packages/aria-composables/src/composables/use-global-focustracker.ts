import { ref, provide, inject, computed, InjectionKey } from 'vue'
import { useEvent } from './use-events'

import { FocusTrackerState } from '../types'

export const key: InjectionKey<FocusTrackerState> = Symbol('globalFocusTracker')

export function provideGlobalFocusTracking(doProvide: boolean = true) {
  // all elements that are not claimed by an explicit FocusGroup
  // are part of the global FocusGroup

  const prevEl = ref<HTMLElement | null>(null)
  const activeEl = ref<HTMLElement | null>(
    document.activeElement as HTMLElement
  )
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
  const state = {
    // State
    prevEl: computed(() => prevEl.value),
    activeEl: computed(() => activeEl.value),
    currentEl: computed(() => (docHasFocus.value ? activeEl.value : null)),
    tabDirection: useTabDirection(),
  }
  doProvide && provide(key, state)

  return state
}

export function useGlobalFocusTracker() {
  return inject(key) as FocusTrackerState
}

function useTabDirection() {
  const tabDirection = ref<'backward' | 'forward' | null>(null)
  useEvent(document, 'keydown', ((event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      tabDirection.value = event.shiftKey ? 'backward' : 'forward'
    }
  }) as EventHandlerNonNull)

  return computed(() => tabDirection.value)
}
