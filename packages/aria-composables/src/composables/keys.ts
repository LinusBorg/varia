import { Ref } from 'vue'
import { useEventIf } from './events'

type ArrowKeyHandlers = {
  up?: EventHandlerNonNull
  down?: EventHandlerNonNull
  left?: EventHandlerNonNull
  right?: EventHandlerNonNull
}

export function useKeyIf(
  condRef: Ref<boolean>,
  keys: string[],
  handler: EventListener,
  opts?: boolean | AddEventListenerOptions
) {
  return useEventIf(
    condRef,
    document,
    'keyup',
    ((e: KeyboardEvent) => {
      if (keys.indexOf((e as any).key) === -1) return
      handler(e)
    }) as EventListener,
    opts
  )
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
        left && left(e)
        break
      case 'Up':
      case 'ArrowUp':
        up && up(e)
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
