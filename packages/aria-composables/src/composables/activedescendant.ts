import { computed, Ref, watch } from 'vue'
import { useArrowKeys } from './keys'
import { useIdGenerator } from '../utils/id-generator'
import { useFocusMoverMachine } from './focusMoverMachine'
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
    service,
    forward,
    backward,
    setIndex,
  } = useFocusMoverMachine(elements, {
    active: isActive.value,
    loop: options.loop,
  })
  watch(isActive, _isActive =>
    service.send(_isActive ? 'DEACTIVATE' : 'ACTIVATE')
  )

  const activeId = computed(() => elements.value[selectedIndex.value]?.id || '')

  const genId = useIdGenerator(options.idNamespace)
  // Container Attributes Generator
  const containerAttrs = computed(() => {
    return {
      'aria-activedescendant': activeId,
      tabindex: 0,
      'aria-owns': elements.value.map(el => el.id).join(' '),
    }
  })
  // Items Attributes Generator
  const genItemAttrs = (name: string) => ({
    onClick: handleClick,
    id: genId(name),
  })

  function handleClick(event: Event) {
    const el = event.target as HTMLElement
    const { id } = el
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
    genItemAttrs,
    setIndex,
    forward,
    backward,
  }
}
