import { Ref, watch, reactive, computed } from '@vue/composition-api'
import { useEventIf } from './use-events'
import { applyFocus } from '../utils'
import { useGlobalFocusTracker } from './use-global-focustracker'

const focusTrapQueue = useFocusTrapQueue()

export function useFocusTrap(
  elements: Ref<HTMLElement[]>,
  conditionRef: Ref<boolean>
) {
  const { tabDirection } = useGlobalFocusTracker()
  const id = Symbol('focusGroupId')

  watch(conditionRef, isActive => {
    if (isActive) {
      focusTrapQueue.add(id)
    } else {
      focusTrapQueue.remove(id)
    }
  })

  useEventIf(conditionRef, document, 'focusout', event => {
    const el = event.target
    const els = elements.value
    if (els[0] === el && tabDirection.value === 'backward') {
      const lastEl = els[els.length - 1]
      applyFocus(lastEl)
    } else if (els[els.length - 1] === el && tabDirection.value === 'forward') {
      const firstEl = els[0]
      applyFocus(firstEl)
    }
  })
}

function useFocusTrapQueue() {
  const queue = reactive<Set<Symbol>>(new Set())
  const remove = (id: Symbol) => queue.delete(id)
  const add = (id: Symbol) => {
    remove(id)
    queue.add(id)
  }
  const active = computed(() => Array.from(queue).reverse()[0])
  return Object.seal({
    active,
    add,
    remove,
  })
}
