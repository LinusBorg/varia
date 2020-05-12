import { ref, provide, computed, inject, InjectionKey, readonly } from 'vue'
import { useEvent } from './events'
import { TabDirection } from '../types'

export const tabDirectionKey: InjectionKey<TabDirection> = Symbol(
  'TabDirectionKey'
)

export const tabDirection = ref<'backward' | 'forward' | undefined>()

useEvent(document, 'keydown', ((event: KeyboardEvent) => {
  if (event.key === 'Tab') {
    tabDirection.value = event.shiftKey ? 'backward' : 'forward'
  }
}) as EventListener)

export function useTabDirection() {
  return inject(
    tabDirectionKey,
    (computed(() => null) as unknown) as TabDirection // default
  )
}

export function provideTabDirection() {
  const ro_tabDirection = readonly(tabDirection)
  provide(tabDirectionKey, ro_tabDirection)
  return ro_tabDirection
}
