import { computed, reactive, ref, Ref, toRefs, defineComponent, h } from 'vue'
import {
  useArrowKeys,
  useKeyIf,
  wrapProp,
  TemplRef,
  useElementFocusObserver,
} from '@varia/composables'

interface useSliderValues {
  min: number
  max: number
  step: number
  jump?: number
}
interface useSliderOptions {
  orientation?: 'vertical'
  presenter?: (value: number) => string
}

interface MouseState {
  active: boolean
  x: number
  y: number
  dx: number
  dy: number
}

const defaultMouseState: MouseState = {
  active: false,
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
}

const onMousedownFactory = (state: MouseState) => (event: MouseEvent) => {
  state.active = true
  state.x = event.pageX
  state.y = event.pageY
}
const onMousemoveFactory = (state: MouseState) => (event: MouseEvent) => {
  state.dx = state.x - event.pageX
  state.dy = state.y - event.pageY
}
const onMouseupFactory = (state: MouseState) => (event: MouseEvent) => {
  Object.assign(state, defaultMouseState)
}

const defaultValues = {
  min: 0,
  max: 100,
  step: 1,
  jump: 0,
}

export function useSlider(
  valueRef: Ref<number>,
  _values: Partial<useSliderValues> = {},
  options: useSliderOptions = {}
) {
  const vals = computed(() => Object.assign({}, defaultValues, _values))
  const { orientation, presenter } = options

  const el: TemplRef = ref()
  const { hasFocus } = useElementFocusObserver(el)

  const inc = () =>
    valueRef.value < vals.value.max &&
    (valueRef.value = Math.min(
      valueRef.value + vals.value.step,
      vals.value.max
    ))
  const dec = () =>
    valueRef.value > vals.value.min &&
    (valueRef.value = Math.max(
      vals.value.min,
      valueRef.value - vals.value.step
    ))
  const set = (v: number) =>
    Math.max(vals.value.min, Math.min(v, vals.value.max))

  useArrowKeys(hasFocus, {
    up: inc,
    right: inc,
    down: dec,
    left: dec,
  })

  useKeyIf(hasFocus, ['Home', 'End'], ((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Home':
        valueRef.value = vals.value.max
        break
      case 'End':
        valueRef.value = vals.value.min
        break
      default:
        return
    }
  }) as EventListener)

  if (vals.value.jump) {
    useKeyIf(hasFocus, ['PageUp'], () => {
      valueRef.value < vals.value.max &&
        (valueRef.value = Math.min(
          vals.value.max,
          valueRef.value + vals.value.jump
        ))
    })
    useKeyIf(hasFocus, ['PageDown'], () => {
      valueRef.value > vals.value.min &&
        (valueRef.value = Math.max(
          vals.value.min,
          valueRef.value - vals.value.jump
        ))
    })
  }

  const state = reactive<MouseState>({
    active: false,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
  })
  const onMousedown = onMousedownFactory(state)
  const onMousemove = onMousemoveFactory(state)
  const onMouseup = onMouseupFactory(state)

  return computed(() => ({
    ref: el,
    onMousedown,
    onMousemove,
    onMouseup,
    'aria-valuenow': valueRef.value,
    'aria-valuemin': vals.value.min,
    'aria-valuemax': vals.value.max,
    'aria-orientation': orientation,
    'aria-value-text': presenter ? presenter(valueRef.value) : undefined,
  }))
}

type Props = {
  tag?: string
  modelValue: number
}
export const Slider = defineComponent<Props>({
  name: 'Slider',
  setup(props) {
    const state = wrapProp(props, 'modelValue')
    const attributes = useSlider(state)
    return () => h(props.tag || 'DIV', attributes.value)
  },
})
