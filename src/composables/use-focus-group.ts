import {
  ref,
  Ref,
  computed,
  onBeforeUnmount,
  watch,
} from '@vue/composition-api'
import { useKeyIf } from './use-events'
import { useGlobalFocusTracker } from './use-global-focustracker'
import { applyFocus } from '../utils'

interface useFocusGroupOptions {
  returnOnEscape?: false | true
  returnOnUnMount?: false | true
}

export function useFocusGroup(
  templateRefs: Ref<HTMLElement[]>,
  { returnOnEscape = false, returnOnUnMount = false }: useFocusGroupOptions = {}
) {
  const {
    prevEl: prevElGlobal,
    currentEl: currentElGlobal,
  } = useGlobalFocusTracker()

  const currentTabindex = computed(
    () =>
      currentElGlobal.value && templateRefs.value.indexOf(currentElGlobal.value)
  )
  const containsFocus = computed(() => currentTabindex.value !== -1)
  const currentEl = computed(() =>
    containsFocus.value ? currentElGlobal.value : null
  )
  const returnEl = ref<HTMLElement>(null)
  watch(prevElGlobal, prevEl => {
    // when we have focus in this focus group
    // and the previously focused element
    // is outside of this focus group,
    // we cache this element as the one we can return focus to.
    if (
      containsFocus.value &&
      prevElGlobal.value &&
      templateRefs.value.indexOf(prevElGlobal.value) === -1
    ) {
      returnEl.value = prevElGlobal.value
    }
  })

  function setFocusToIndex(index: number) {
    const el = templateRefs.value[index]
    el && applyFocus(el)
  }

  function returnFocus() {
    const el = returnEl.value
    el && el.isConnected && applyFocus(el)
  }

  if (returnOnUnMount) {
    onBeforeUnmount(returnFocus)
  }
  if (returnOnEscape) {
    useKeyIf(containsFocus, ['Esc'], ((e: KeyboardEvent) => {
      returnFocus()
    }) as EventHandlerNonNull)
  }

  return {
    // state
    isActive: containsFocus,
    currentEl,
    currentTabindex,
    returnEl: computed(() => returnEl.value),
    // Fns
    returnFocus,
    setFocusToIndex,
  }
}
