import { useArrowKeys } from './use-arrow-keys'
import { applyFocus } from '../utils'
import { watch, Ref } from '@vue/composition-api'

export function useRowingTabIndex(
  templateRefs: Ref<HTMLElement[]>,
  indexRef: Ref<number>,
  conditionRef: Ref<boolean>,
  orientation = 'vertical', // "horizontal"
  loop = true
) {
  // imperatively manage tabindex so template stays clean
  watch([templateRefs, indexRef], (([els, index]: [HTMLElement[], number]) => {
    for (var i = 0; i < els.length; i++) {
      els[i].tabIndex = i === index ? 0 : -1
    }
  }) as any)

  const forward = () => {
    let i = indexRef.value + 1
    if (i >= templateRefs.value.length && loop) i = 0
    const el = templateRefs.value[i]
    el && applyFocus(el)
  }
  const backward = () => {
    let i = indexRef.value - 1
    if (i < 0 && loop) i = templateRefs.value.length - 1
    const el = templateRefs.value[i]
    el && applyFocus(el)
  }

  // Arrow Key Handling
  const backDir = orientation === 'vertical' ? 'up' : 'left'
  const fwdDir = orientation === 'vertical' ? 'down' : 'right'
  useArrowKeys(conditionRef, {
    [backDir]: backward,
    [fwdDir]: forward,
  })

  return {
    forward,
    backward,
  }
}
