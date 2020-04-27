import { computed, Ref, watchEffect } from 'vue'
import { useArrowKeys } from './keys'
import { useIndexMover } from './index-mover'
import { nanoid } from 'nanoid/non-secure'
interface useActiveDescendantOptions {
  idNamespace?: string
  loop?: boolean
  orientation?: 'vertical' | 'horizontal'
}

export function useActiveDescendant(
  elements: Ref<HTMLElement[]>,
  isActive: Ref<boolean>,
  options: useActiveDescendantOptions = {}
) {
  const {
    selectedIndex,
    forward: moveIndexForward,
    backward: moveIndexBackward,
    setIndex,
  } = useIndexMover(elements, {
    loop: options.loop,
  })

  const forward = () => isActive.value && moveIndexForward()
  const backward = () => isActive.value && moveIndexBackward()

  const activeId = computed(() => elements.value[selectedIndex.value]?.id || '')

  watchEffect(() => {
    elements.value.forEach(el => !!el.id && (el.id = nanoid()))
  })
  // Container Attributes Generator
  const containerAttrs = computed(() => {
    return {
      'aria-activedescendant': activeId,
      tabindex: 0,
      'aria-owns': elements.value.map(el => el.id).join(' '),
    }
  })

  function focusbyId(id: string) {
    if (id) {
      const index = elements.value.findIndex(el => el.id === id)
      index !== -1 && setIndex(index)
    }
  }

  // Keyboard navigation
  const backDir = options.orientation === 'vertical' ? 'up' : 'left'
  const fwdDir = options.orientation === 'vertical' ? 'down' : 'right'

  useArrowKeys(isActive, {
    [fwdDir]: forward,
    [backDir]: backward,
  })

  return {
    // state
    containerAttrs,
    activeId,

    // Fns
    focusbyId,
    focusByIndex: setIndex,
    forward,
    backward,
  }
}
