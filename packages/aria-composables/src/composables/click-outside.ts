import { onMounted, onUnmounted, unref, nextTick } from 'vue'
import { useEvent } from './events'
import { MaybeTemplRef } from '../types'

// TODO: needs to take teleported elements into account.
export function useClickOutside(
  _els: MaybeTemplRef[],
  cb: (...args: any[]) => any
) {
  let unwatch: ReturnType<typeof useEvent>
  onMounted(() => {
    nextTick(() => {
      unwatch = useEvent(document, 'click', ({ target }) => {
        const els = _els.map(unref).filter(Boolean) as HTMLElement[]
        const isOutside = els.every(el => {
          return el !== target && !el?.contains(target as Node)
        })
        isOutside && cb(event)
      })
    })
  })
  onUnmounted(() => unwatch())
}
