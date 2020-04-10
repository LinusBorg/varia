import { computed, InjectionKey } from 'vue'
import { useGlobalFocusTracker } from './use-global-focustracker'
import { useReturnBehaviour } from './use-return-behaviour'
import { applyFocus } from '../utils'
import { TemplateRefs, useFocusGroupOptions } from '../types'

export const GroupInterfaceKey: InjectionKey<any> = Symbol('GroupInterface')

export function useFocusGroup(
  elements: TemplateRefs,
  options: useFocusGroupOptions = {}
) {
  const { integrateWithParentGroup, includeChildComponents } = options
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
    // other
    ...useReturnBehaviour(containsFocus, options),
  }
}
