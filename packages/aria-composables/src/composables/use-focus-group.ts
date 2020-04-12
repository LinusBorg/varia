import { computed, InjectionKey, Ref } from 'vue'
import { useGlobalFocusTracker } from './use-global-focustracker'
import { applyFocus } from '../utils'

export const GroupInterfaceKey: InjectionKey<any> = Symbol('GroupInterface')

export function useFocusGroup(elements: Ref<HTMLElement[]>) {
  const { currentEl: currentElGlobal } = useGlobalFocusTracker()

  const currentTabindex = computed(
    () => currentElGlobal.value && elements.value.indexOf(currentElGlobal.value)
  )
  const containsFocus = computed(() => currentTabindex.value !== -1)
  const currentEl = computed(() =>
    containsFocus.value ? currentElGlobal.value : null
  )

  function setFocusToIndex(index: number) {
    const el = elements.value[index]
    return el && applyFocus(el)
  }

  return {
    // state
    isActive: containsFocus,
    currentEl,
    currentTabindex,
    // Fns
    setFocusToIndex,
  }
}
