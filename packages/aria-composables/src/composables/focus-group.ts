import { computed, Ref } from 'vue'
import { useFocusTracker } from './focus-tracker'
import { applyFocus } from '../utils'

export function useFocusGroup(elements: Ref<readonly HTMLElement[]>) {
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
