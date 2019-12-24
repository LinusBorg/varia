import { ref, Ref, watch } from '@vue/composition-api'
import { MaybeRef } from '~/types'
import { wrap } from '../utils'

type MaybeRefElement = MaybeRef<HTMLElement | typeof document>

export function useEvent(
  _el: MaybeRefElement = ref(document),
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
  elRef: MaybeRefElement,
  name: string,
  handler: EventHandlerNonNull,
  opts?: any
) {
  useEvent(elRef, name, event => condRef.value && handler(event), opts)
}

export function useKeyIf(
  condRef: Ref<boolean>,
  keys: string[],
  handler: (e?: KeyboardEvent) => void,
  opts?: any
) {
  useEventIf(condRef, document, 'keyup', e => {
    if (keys.indexOf((e as any).key) === -1) return
    handler(e as KeyboardEvent)
  })
}
