import { onMounted, onUnmounted, unref, nextTick } from 'vue'
import { MaybeRef } from 'vue-aria-composables'
import { useEvent } from './events'

useEvent

export function useClickOutside(
  _els: MaybeRef<HTMLElement | undefined>[],
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
