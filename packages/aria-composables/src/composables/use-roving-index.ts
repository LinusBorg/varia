import { useArrowKeys } from './use-arrow-keys'
import { applyFocus } from '../utils'
import { watch, watchEffect, Ref } from 'vue'
import { useKeyIf } from './use-events'
import { useFocusMoverMachine } from './focusMoverMachine'

interface IUseRovingTabIndexOptions {
  orientation?: 'vertical' | 'horizontal'
  loop?: boolean
}
const defaults = {
  orientation: 'vertical', // "horizontal"
  loop: true,
}
export function useRovingTabIndex(
  elements: Ref<HTMLElement[]>,
  isActive: Ref<boolean>,
  options: IUseRovingTabIndexOptions = {}
) {
  const { orientation /*, loop*/ } = Object.assign({}, defaults, options)

  const {
    selectedIndex: focusIndex,
    forward,
    backward,
    setIndex,
  } = useFocusMoverMachine(elements, {
    active: isActive.value,
  })

  // imperatively manage tabindex so template stays clean
  watchEffect(() => {
    const els = elements.value
    for (var i = 0; i < els.length; i++) {
      els[i].tabIndex = i === focusIndex.value ? 0 : -1
    }
  })

  // Apply focus when Index changes
  watch(focusIndex, (i: number) => applyFocus(elements.value[i]))

  // Arrow Key Handling
  const backDir = orientation === 'vertical' ? 'up' : 'left'
  const fwdDir = orientation === 'vertical' ? 'down' : 'right'
  useArrowKeys(isActive, {
    [backDir]: backward,
    [fwdDir]: forward,
  })

  useKeyIf(isActive, ['Home', 'End'], ((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Home':
        setIndex(0)
        break
      case 'End':
        setIndex(elements.value.length - 1)
        break
      default:
        return
    }
  }) as EventListener)

  return {
    forward,
    backward,
    index: focusIndex,
  }
}
