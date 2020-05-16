import { Ref } from 'vue'
import { useEventIf } from './events'

import { ArrowKeyHandlers } from '../types'

export function useKeyIf(
  condRef: Ref<boolean>,
  keys: string[],
  handler: (event: KeyboardEvent) => void,
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
  { up, down, left, right }: ArrowKeyHandlers = {},
  {
    orientation,
  }: {
    orientation?: 'horizontal' | 'vertical'
  } = {}
) {
  const o = orientation
  const handleKeyup = (e: KeyboardEvent) => {
    const key = e.key
    switch (key) {
      case 'Left':
      case 'ArrowLeft':
        left && (!o || o === 'horizontal') && left(e)
        break
      case 'Up':
      case 'ArrowUp':
        up && (!o || o === 'vertical') && up(e)
        break
      case 'Right':
      case 'ArrowRight':
        right && (!o || o === 'horizontal') && right(e)
        break
      case 'Down':
      case 'ArrowDown':
        down && (!o || o === 'vertical') && down(e)
        break
      default:
        break
    }
  }
  return useEventIf(condRef, document, 'keyup', handleKeyup as EventListener)
}
