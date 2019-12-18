import { Ref, watch } from '@vue/composition-api'
import { useEventIf } from './use-events'
import { applyFocus } from '../utils'
import { useGlobalFocusTracker } from './use-global-focustracker'

export function useFocusTrap(
  templateRefs: Ref<HTMLElement[]>,
  conditionRef: Ref<boolean>
) {
  const { tabDirection, focusTrapQueue } = useGlobalFocusTracker()
  const id = Symbol('focusGroupId')

  watch(conditionRef, isActive => {
    if (isActive) {
      focusTrapQueue.add(id)
    } else {
      focusTrapQueue.remove(id)
    }
  })

  useEventIf(conditionRef, document, 'focusout', event => {
    const el = event.target
    const els = templateRefs.value
    if (els[0] === el && tabDirection.value === 'backward') {
      const lastEl = els[els.length - 1]
      applyFocus(lastEl)
    } else if (els[els.length - 1] === el && tabDirection.value === 'forward') {
      const firstEl = els[0]
      applyFocus(firstEl)
    }
  })
}
