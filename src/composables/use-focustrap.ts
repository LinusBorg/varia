import {
  Ref,
  reactive,
  computed,
  onMounted,
  onUnmounted,
} from '@vue/composition-api'
import { useEventIf } from './use-events'
import { applyFocus } from '../utils'
import { useGlobalFocusTracker } from './use-global-focustracker'

const focusTrapQueue = useFocusTrapQueue()

interface FocusTrapOptions {
  skipFirst?: boolean
  skipLast?: boolean
  activateOnMount?: boolean
}
export function useFocusTrap(
  elements: Ref<HTMLElement[]>,
  options: FocusTrapOptions = {}
) {
  const id = Symbol('focusGroupId')
  const activate = () => focusTrapQueue.add(id)
  const deactivate = () => focusTrapQueue.remove(id)
  const isTrapActive = computed(() => focusTrapQueue.active.value === id)
  options.activateOnMount && onMounted(activate)
  onUnmounted(deactivate)

  // restrict Tab Sequence
  const { tabDirection } = useGlobalFocusTracker()
  useEventIf(isTrapActive, document, 'focusout', event => {
    const el = event.target
    const els = elements.value
    const firstEl = els[options.skipFirst ? 1 : 0]
    const lastEl = els[els.length - (options.skipLast ? 1 : 2)]
    if (firstEl === el && tabDirection.value === 'backward') {
      applyFocus(lastEl)
    } else if (lastEl === el && tabDirection.value === 'forward') {
      applyFocus(firstEl)
    }
  })

  // return focus if - for whatever reason, i.e. a mouse click,
  // any element not included of the trap's elements has received focus
  const focusTracker = useGlobalFocusTracker()
  useEventIf(
    isTrapActive,
    document,
    'focusin',
    event => {
      // TODO: does this need a nextTick? Will have to test this ...
      if (elements.value.indexOf(event.target as HTMLElement) === -1) {
        focusTracker.prevEl.value && applyFocus(focusTracker.prevEl.value)
      }
    },
    { capture: true }
  )

  // first element should never have focus
  // it merely serves as a goalpost
  if (options.skipFirst) {
    useEventIf(
      isTrapActive,
      computed(() => elements.value[0]),
      'focusin',
      () => {
        applyFocus(elements.value[1])
      }
    )
  }
  // last element should never have focus
  if (options.skipLast) {
    useEventIf(
      isTrapActive,
      computed(() => elements.value[elements.value.length - 1]),
      'focusin',
      () => {
        applyFocus(elements.value[elements.value.length - 2])
      }
    )
  }

  return {
    isActive: computed(() => isTrapActive.value),
    activate,
    deactivate,
  }
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
