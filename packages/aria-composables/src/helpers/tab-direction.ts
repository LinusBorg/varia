import { ref, provide, computed, inject, InjectionKey, readonly } from 'vue'
import { useEvent } from '../composables/events'
import { TabDirection } from '../types'
import { TABBABLE_ELS } from '../utils/focusable-elements'

export const tabDirectionKey: InjectionKey<TabDirection> = Symbol(
  'TabDirectionKey'
)

export const tabDirection = ref<'backward' | 'forward' | undefined>()

useEvent(document, 'keydown', ((event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    tabDirection.value = event.shiftKey ? 'backward' : 'forward'
  }
}) as EventListener)

useEvent(document, 'click', ((event: MouseEvent) => {
  if ((event.target as Element).matches(TABBABLE_ELS)) {
    setTimeout(() => (tabDirection.value = undefined), 0)
  }
}) as EventListener)
