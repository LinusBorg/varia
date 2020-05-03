import { useArrowKeys } from './keys'
import { applyFocus } from '../utils'
import { watch, Ref } from 'vue'
import { useKeyIf } from './keys'
import { useIndexMover } from './index-mover'

interface IUseRovingTabIndexOptions {
  orientation?: 'vertical' | 'horizontal'
  loop?: boolean
}
const defaults = {
  orientation: 'vertical', // "horizontal"
  loop: true,
}
export function useRovingTabIndex(
  elements: Ref<readonly HTMLElement[]>,
  isActive: Ref<boolean>,
  options: IUseRovingTabIndexOptions = {}
) {
  const { orientation, loop } = Object.assign({}, defaults, options)

  const {
    selectedIndex: focusIndex,
    forward: moveIndexForward,
    backward: moveIndexBackward,
    setIndex,
  } = useIndexMover(elements, {
    loop,
  })

  const forward = () => isActive.value && moveIndexForward()
  const backward = () => isActive.value && moveIndexBackward()

  // Apply focus when Index changes
  watch(focusIndex, (i: number) => isActive && applyFocus(elements.value[i]))

  // Arrow Key Handling
  const backDir = orientation === 'vertical' ? 'up' : 'left'
  const fwdDir = orientation === 'vertical' ? 'down' : 'right'
  useArrowKeys(isActive, {
    [backDir]: (event: KeyboardEvent) => {
      if (event.shiftKey || event.ctrlKey) return
      backward()
    },
    [fwdDir]: (event: KeyboardEvent) => {
      if (event.shiftKey || event.ctrlKey) return
      forward()
    },
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

  const focusByElement = (el: HTMLElement) => {
    const idx = elements.value.indexOf(el)
    if (idx !== -1) setIndex(idx)
  }

  return {
    forward,
    backward,
    index: focusIndex,
    focusByIndex: setIndex,
    focusByElement,
  }
}
