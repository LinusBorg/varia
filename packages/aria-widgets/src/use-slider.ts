import { computed, ref, Ref, toRefs } from 'vue'
import { useArrowKeys, useKeyIf, useFocusGroup } from 'vue-aria-composables'

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

const defaultValues = {
  min: 0,
  max: 100,
  step: 1,
  jump: 0,
}

export function useSlider(
  valueRef: Ref<number>,
  values: Partial<useSliderValues> = {},
  options: useSliderOptions = {}
) {
  const { min, max, jump, step } = toRefs(Object.assign(defaultValues, values))
  const { orientation, presenter } = options

  const element = ref<HTMLElement | null>(null)
  const { hasFocus } = useFocusGroup(
    computed(() => (element.value ? [element.value] : []))
  )
  const inc = () =>
    valueRef.value < max.value &&
    (valueRef.value = Math.min(valueRef.value + step.value, max.value))
  const dec = () =>
    valueRef.value > min.value &&
    (valueRef.value = Math.max(min.value, valueRef.value - step.value))

  useArrowKeys(hasFocus, {
    up: inc,
    right: inc,
    down: dec,
    left: dec,
  })

  useKeyIf(hasFocus, ['Home', 'End'], ((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Home':
        valueRef.value = max.value
        break
      case 'End':
        valueRef.value = min.value
        break
      default:
        return
    }
  }) as EventListener)

  if (jump) {
    useKeyIf(hasFocus, ['PageUp'], () => {
      valueRef.value < max.value &&
        (valueRef.value = Math.min(max.value, valueRef.value + jump.value))
    })
    useKeyIf(hasFocus, ['PageDown'], () => {
      valueRef.value > min.value &&
        (valueRef.value = Math.max(min.value, valueRef.value + jump.value))
    })
  }

  return {
    element,
    attrs: computed(() => ({
      ariaValuenow: valueRef.value,
      ariaValuemin: min,
      ariaValuemax: max,
      ariaOrientation: orientation,
      ariaValueText: presenter ? presenter(valueRef.value) : undefined,
    })),
  }
}
