import { Ref } from 'vue'
import { useTabbable, TabbableOptions } from '../Tabbable'
import { useEvent } from 'vue-aria-composables'

export { TabbableProps as ClickableProps } from '../Tabbable'
export interface ClickableOptions extends TabbableOptions {}

export function useClickable(
  options: ClickableOptions,
  el?: Ref<HTMLElement | undefined>
) {
  const tabbableAttrs = useTabbable(options, el)
  useEvent(el, 'keyup', ((e: KeyboardEvent) => {
    if (el?.value?.tagName === 'BUTTON') return
    if (e.key === 'Enter' || e.key === ' ') {
      el?.value?.click()
    }
  }) as EventListener)

  return tabbableAttrs
}
