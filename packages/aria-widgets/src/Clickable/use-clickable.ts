import { Ref } from 'vue'
import { ClickableOptions } from '../types'
import { useTabbable } from '../Tabbable'
import { useEvent, focusTracker } from '@varia/composables'

export { TabbableProps as ClickableProps } from '../Tabbable'

export function useClickable(
  options: ClickableOptions,
  el?: Ref<HTMLElement | undefined>
) {
  const tabbableAttrs = useTabbable(options, el)
  useEvent(document, 'keydown', ((e: KeyboardEvent) => {
    const el = tabbableAttrs.value.ref
    if (e.target !== el.value) return
    if (el?.value?.tagName === 'BUTTON') return
    if (e.key === 'Enter' || e.key === ' ') {
      el?.value?.click()
    }
    focusTracker.currentEl.value === tabbableAttrs.value.ref.value &&
      e.key === ' ' &&
      e.preventDefault()
  }) as EventListener)

  return tabbableAttrs
}
