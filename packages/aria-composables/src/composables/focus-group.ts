import { computed, InjectionKey, Ref } from 'vue'
import { useGlobalFocusTracker } from './focus-tracker'
import { applyFocus } from '../utils'

export const GroupInterfaceKey: InjectionKey<any> = Symbol('GroupInterface')

export function useFocusGroup(elements: Ref<HTMLElement[]>) {
  const { currentEl: currentElGlobal } = useGlobalFocusTracker()

  const currentTabindex = computed(
    () => currentElGlobal.value && elements.value.indexOf(currentElGlobal.value)
  )
  const hasFocus = computed(() => currentTabindex.value !== -1)
  const currentEl = computed(() =>
    hasFocus.value ? currentElGlobal.value : null
  )

  function setFocusToIndex(index: number) {
    const el = elements.value[index]
    return el && applyFocus(el)
  }

  return {
    // state
    hasFocus,
    currentEl,
    currentTabindex,
    // Fns
    setFocusToIndex,
  }
}
