import { computed, ref } from 'vue'
import { useFocusTracker } from './focus-tracker'
import { applyFocus } from '../utils'
import { MaybeRef } from '../types'

export function useFocusGroup(_elements: MaybeRef<readonly HTMLElement[]>) {
  const elements = ref(_elements)
  const { currentEl: currentElGlobal } = useFocusTracker()

  const currentIndex = computed(() =>
    currentElGlobal.value ? elements.value.indexOf(currentElGlobal.value) : -1
  )
  const hasFocus = computed(() => currentIndex.value > -1)
  const currentEl = computed(() =>
    hasFocus.value ? currentElGlobal.value : undefined
  )

  function setFocusToIndex(index: number) {
    const el = elements.value[index]
    return el && applyFocus(el)
  }

  return {
    hasFocus,
    currentEl,
    currentIndex,
    setFocusToIndex,
  }
}
