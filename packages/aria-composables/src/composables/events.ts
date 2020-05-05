import { ref, Ref, watch } from 'vue'
import { MaybeRef, TemplRefType } from '../types'

export type ElementRefs =
  | MaybeRef<TemplRefType>
  | MaybeRef<Window>
  | MaybeRef<Document>

export function useEvent<Evt extends Event = Event>(
  _el: ElementRefs,
  name: string,
  handler: (event: Evt) => void,
  opts?: boolean | AddEventListenerOptions
) {
  const el = ref((_el as unknown) as Element)
  const unwatch = watch(
    el,
    (el, _, onCleanup) => {
      el && el.addEventListener(name, handler as EventListener, opts)
      onCleanup(() => {
        el && el.removeEventListener(name, handler as EventListener, opts)
      })
    },
    { immediate: true }
  )

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
