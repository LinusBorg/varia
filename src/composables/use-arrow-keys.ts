import { Ref } from '@vue/composition-api'
import { useEventIf } from './use-events'

type ArrowKeyHandlers = {
  up?: EventHandlerNonNull
  down?: EventHandlerNonNull
  left?: EventHandlerNonNull
  right?: EventHandlerNonNull
}

export function useArrowKeys(
  condRef: Ref<boolean>,
  { up, down, left, right }: ArrowKeyHandlers = {}
) {
  const handleKeyup = (e: KeyboardEvent) => {
    const key = e.key
    switch (key) {
      case 'Left':
      case 'ArrowLeft':
        up && up(e)
        break
      case 'Up':
      case 'ArrowUp':
        left && left(e)
        break
      case 'Right':
      case 'ArrowRight':
        right && right(e)
        break
      case 'Down':
      case 'ArrowDown':
        down && down(e)
        break
      default:
        break
    }
  }
  return useEventIf(
    condRef,
    document,
    'keyup',
    handleKeyup as EventHandlerNonNull
  )
}
