import { computed, ref, Ref, toRefs } from '@vue/composition-api'
import { useArrowKeys } from '../composables/use-arrow-keys'
import { useKeyIf } from '../composables/use-events'
import { useFocusGroup } from '../composables/use-focus-group'
import { TemplateRefs } from '../types'

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

  const element = ref<HTMLElement>(null)
  const { isActive } = useFocusGroup(
    computed(() => [element.value]) as TemplateRefs
  )
  const inc = () =>
    valueRef.value < max.value &&
    (valueRef.value = Math.min(valueRef.value + step.value, max.value))
  const dec = () =>
    valueRef.value > min.value &&
    (valueRef.value = Math.max(min.value, valueRef.value - step.value))

  useArrowKeys(isActive, {
    up: inc,
    right: inc,
    down: dec,
    left: dec,
  })

  useKeyIf(isActive, ['Home', 'End'], (event: KeyboardEvent) => {
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
  })
  if (jump) {
    useKeyIf(isActive, ['PageUp'], () => {
      valueRef.value < max.value &&
        (valueRef.value = Math.min(max.value, valueRef.value + jump.value))
    })
    useKeyIf(isActive, ['PageDown'], () => {
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
