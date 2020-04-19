import { ref, provide, computed, inject, InjectionKey, ComputedRef } from 'vue'
import { useEvent } from './events'

export type TabDirection = ComputedRef<'forward' | 'backward' | undefined>
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
  provide(tabDirectionKey, tabDirection)
  return computed(() => tabDirection.value)
}
