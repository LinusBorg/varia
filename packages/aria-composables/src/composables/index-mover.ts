import { ref, computed, readonly } from 'vue'
import { MaybeRef } from '../types'

interface FocusMoverOptions {
  initialIndex?: number
  loop?: boolean
}

export function useIndexMover(
  _elements: MaybeRef<readonly any[]>,
  options: FocusMoverOptions = {}
) {
  const elements = ref(_elements)
  const selectedIndex = ref(options.initialIndex ?? 0)
  const max = computed(() => elements.value.length - 1)

  const forward = () =>
    selectedIndex.value >= max.value
      ? options.loop
        ? (selectedIndex.value = 0)
        : void 0
      : selectedIndex.value++
  const backward = () =>
    selectedIndex.value <= 0
      ? options.loop
        ? (selectedIndex.value = max.value)
        : void 0
      : selectedIndex.value--

  const setIndex = (n: number): void => {
    if (n > max.value || n < 0) return // TODO: Warn
    selectedIndex.value = n
  }

  return {
    selectedIndex: readonly(selectedIndex),
    forward,
    backward,
    setIndex,
  }
}
