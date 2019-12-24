import { useArrowKeys } from './use-arrow-keys'
import { applyFocus } from '../utils'
import { watch, Ref, ref } from '@vue/composition-api'
import { useKeyIf } from './use-events'

export function useRovingTabIndex(
  elements: Ref<HTMLElement[]>,
  isActiveRef: Ref<boolean>,
  selectedIndexRef: Ref<number> = ref(0),
  orientation = 'vertical', // "horizontal"
  loop = true
) {
  const focusIndexRef = ref<number>(selectedIndexRef?.value || 0)

  watch(() => {
    // When the focusgroup is active, we don't want to switch the index
    // as that might confuse the user currently navigating.
    // but when it's not active, and the selected index changes, we can
    // safely adjust your internal index.
    if (!isActiveRef.value) {
      focusIndexRef.value =
        selectedIndexRef?.value != null ? selectedIndexRef?.value : 0
    }
  })

  // imperatively manage tabindex so template stays clean
  watch([elements, focusIndexRef], (([els, index]: [HTMLElement[], number]) => {
    for (var i = 0; i < els.length; i++) {
      els[i].tabIndex = i === index ? 0 : -1
    }
  }) as any)

  const forward = () => {
    const length = elements.value.length
    let i = focusIndexRef.value + 1
    if (i >= length && loop) i = 0
    else i = Math.min(i, length - 1)
    const el = elements.value[i]
    focusIndexRef.value = i
    el && applyFocus(el)
  }
  const backward = () => {
    const length = elements.value.length
    let i = focusIndexRef.value - 1
    if (i < 0 && loop) i = length - 1
    else i = Math.max(i, 0)
    const el = elements.value[i]
    focusIndexRef.value = i
    el && applyFocus(el)
  }

  // Arrow Key Handling
  const backDir = orientation === 'vertical' ? 'up' : 'left'
  const fwdDir = orientation === 'vertical' ? 'down' : 'right'
  useArrowKeys(isActiveRef, {
    [backDir]: backward,
    [fwdDir]: forward,
  })

  useKeyIf(isActiveRef, ['Home', 'End'], (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Home':
        focusIndexRef.value = 0
        break
      case 'End':
        focusIndexRef.value = elements.value.length - 1
        break
      default:
        return
    }
    const el = elements.value[focusIndexRef.value]
    el && applyFocus(el)
  })

  return {
    forward,
    backward,
  }
}
