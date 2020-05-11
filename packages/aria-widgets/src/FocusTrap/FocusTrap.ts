import {
  computed,
  readonly,
  reactive,
  Ref,
  ref,
  watch,
  onMounted,
  onUnmounted,
  defineComponent,
  h,
  PropType,
  toRaw,
} from 'vue'
import {
  applyFocus,
  getFirstFocusableChild,
  getLastFocusableChild,
  useFocusTracker,
  useTabDirection,
  TemplRef,
  TemplRefType,
  useEventIf,
  wrapProp,
} from 'vue-aria-composables'

import { useInert } from './inert'

import { FocusTrapOptions } from '../types'

// only one FocusTrap can be active at a time.
// So we track a Queue of all active FocusTraps,
const queue = reactive<Set<Symbol>>(new Set())
const remove = (id: Symbol) => queue.delete(id)
const add = (id: Symbol) => {
  remove(id)
  queue.add(id)
}
const active = computed(() => Array.from(queue).reverse()[0])
const focusTrapQueue = readonly({
  active,
  add,
  remove,
})

const defaultOptions = {
  activateOnMount: true,
}
export function useFocusTrap(
  state: Ref<boolean | undefined>,
  _options: FocusTrapOptions = defaultOptions
) {
  const options = Object.assign({}, defaultOptions, _options)
  const tabDirection = useTabDirection()
  const focusTracker = useFocusTracker()

  const wrapperEl: TemplRef = ref()
  const startEl: TemplRef = ref()
  const endEl: TemplRef = ref()

  const id = Symbol('focusGroupId')
  const activate = () => {
    focusTrapQueue.add(id)
    !state.value && (state.value = true)
  }
  const deactivate = () => {
    focusTrapQueue.remove(id)
    state.value && (state.value = false)
  }
  const isActiveTrap = computed(() => toRaw(focusTrapQueue.active) === id)
  watch(state, state => {
    state ? activate() : deactivate()
  })
  useInert(wrapperEl, isActiveTrap)

  // Mount/Unmount
  options.activateOnMount && onMounted(activate)
  onUnmounted(deactivate)

  const autoMovefocus = (skip: 'forward' | 'backward') => {
    let el: TemplRefType
    switch (tabDirection.value) {
      case 'forward':
        if (skip === 'forward') return
        el = getFirstFocusableChild(wrapperEl.value!)
        el && el.focus()
        break
      case 'backward':
        if (skip === 'backward') return
        el = getLastFocusableChild(wrapperEl.value!)
        el && el.focus()
        break
    }
  }
  // first element should never have focus
  useEventIf(isActiveTrap, startEl, 'focus', () => autoMovefocus('forward'))
  // last element should never have focus
  useEventIf(isActiveTrap, endEl, 'focus', () => autoMovefocus('backward'))

  // move focus if - for whatever reason, i.e. a mouse click,
  // any element not included of the trap's elements has received focus
  useEventIf(isActiveTrap, document, 'focusin', ({ target }) => {
    const wrapper = wrapperEl.value
    if (!wrapper) return
    if (wrapper.contains(target as Node)) return
    if (target === startEl.value || target === endEl.value) return
    const prevEl = focusTracker.prevEl.value
    if (prevEl) {
      if (wrapperEl.value?.contains(prevEl)) {
        // if focus was moved outside of the Trap,
        // bring it back to the last element in the Trap
        applyFocus(prevEl)
      } else {
        // but if the previously focussed Element wasn't inside the FocusTrap,
        // move focus to the first element in the Trap.
        const el = getFirstFocusableChild(wrapperEl.value!)
        el && applyFocus(el)
      }
    }
  })

  return {
    wrapperElAttrs: {
      ref: wrapperEl,
    },
    startElAttrs: computed(() => ({
      ref: startEl,
      'data-varia-visually-hidden': true,
      'data-varia-focustrap-start': true,
      tabindex: isActiveTrap.value ? 0 : undefined,
    })),
    endElAttrs: computed(() => ({
      'data-varia-visually-hidden': true,
      'data-varia-focustrap-end': true,
      ref: endEl,
      tabindex: isActiveTrap.value ? 0 : undefined,
    })),
    isActive: isActiveTrap,
    activate,
    deactivate,
  }
}

const focusTrapProps = {
  tag: String,
  activateOnMount: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  modelValue: {
    type: Boolean as PropType<boolean>,
    required: true,
  },
}

export const FocusTrap = defineComponent({
  name: 'FocusTrap',
  props: focusTrapProps,
  inheritAttrs: false,
  setup(props, { slots }) {
    const state = wrapProp(props, 'modelValue')
    const focusTrap = useFocusTrap(state, props)
    return () => {
      return [
        h('SPAN', focusTrap.startElAttrs.value),
        h(props.tag || 'DIV', focusTrap.wrapperElAttrs, slots.default?.()),
        h('SPAN', focusTrap.endElAttrs.value),
      ]
    }
  },
})
