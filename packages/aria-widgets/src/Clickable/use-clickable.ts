import { useTabbable, TabbableOptions } from '../Tabbable'
import { useEvent } from 'vue-aria-composables'

export interface ClickableOptions extends TabbableOptions {}

export function useClickable(options: ClickableOptions) {
  const tabbableAttrs = useTabbable(options)
  const elRef = tabbableAttrs.ref
  useEvent(elRef, 'keyup', ((e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Space') {
      elRef.value?.focus()
    }
  }) as EventListener)

  return tabbableAttrs
}
