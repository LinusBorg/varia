import { ref, Ref, watch } from 'vue'
import { MaybeRef } from '../types'

export type ElementRefs =
  | MaybeRef<HTMLElement | undefined>
  | MaybeRef<Window>
  | MaybeRef<Document>

export function useEvent(
  _el: ElementRefs,
  name: string,
  handler: (event: Event) => void,
  opts?: boolean | AddEventListenerOptions
) {
  const el = ref((_el as unknown) as Element)
  const unwatch = watch(el, (el, _, onCleanup) => {
    el && el.addEventListener(name, handler, opts)
    onCleanup(() => {
      el && el.removeEventListener(name, handler, opts)
    })
  })

  return unwatch
}

export function useEventIf(
  condRef: Ref<boolean>,
  elRef: ElementRefs,
  name: string,
  handler: EventListener,
  opts?: boolean | AddEventListenerOptions
) {
  return useEvent(
    elRef,
    name,
    <T extends Event>(event: T) => condRef.value && handler(event),
    opts
  )
}
