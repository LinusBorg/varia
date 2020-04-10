import { Ref, watch } from 'vue'
import { MaybeRef } from '../types'
import { wrap } from '../utils'

type MaybeRefElements =
  | Ref<HTMLElement>
  | Ref<Document>
  | Ref<Window>
  | HTMLElement
  | Document
  | Window

export function useEvent<El extends HTMLElement>(
  _el: MaybeRef<El>,
  name: string,
  handler: EventHandlerNonNull,
  opts?: any
): () => void
export function useEvent<El extends Document>(
  _el: MaybeRef<El>,
  name: string,
  handler: EventHandlerNonNull,
  opts?: any
): () => void
export function useEvent<El extends Window>(
  _el: MaybeRef<El>,
  name: string,
  handler: EventHandlerNonNull,
  opts?: any
): () => void
export function useEvent(
  _el: MaybeRefElements,
  name: string,
  handler: EventHandlerNonNull,
  opts?: any
) {
  const el = wrap(_el)
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
  elRef: MaybeRef<MaybeRefElements>,
  name: string,
  handler: EventHandlerNonNull,
  opts?: any
) {
  return useEvent(elRef, name, event => condRef.value && handler(event), opts)
}

export function useKeyIf(
  condRef: Ref<boolean>,
  keys: string[],
  handler: (e: KeyboardEvent) => void,
  opts?: any
) {
  return useEventIf(
    condRef,
    document,
    'keyup',
    e => {
      if (keys.indexOf((e as any).key) === -1) return
      handler(e as KeyboardEvent)
    },
    opts
  )
}
