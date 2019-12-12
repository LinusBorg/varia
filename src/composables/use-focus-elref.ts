import { ref, watch } from '@vue/composition-api'
import { MaybeRef } from '@/types'
import { wrap } from '@/utils'

export function useFocusElRef(_elRef: MaybeRef<HTMLElement>) {
  const elRef = wrap(_elRef) || ref(null)
  const hasFocus = ref<boolean>(null)
  watch(elRef, el => {
    el.addEventListener('focusin', () => (hasFocus.value = true))
    el.addEventListener('focusout', () => (hasFocus.value = false))
  })
  return {
    elRef,
    hasFocus,
  }
}
