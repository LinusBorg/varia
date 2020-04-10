import { computed, ref, Ref, watch, watchEffect } from 'vue'
import { useArrowKeys } from './use-arrow-keys'
import { useIdGenerator } from './use-id-generator'

interface useActiveDescendantOptions {
  idNamespace?: string
  loop?: boolean
  orientation?: 'vertical' | 'horizontal'
}

export function useActiveDescendant(
  elements: Ref<HTMLElement[]>,
  isActiveRef: Ref<boolean>,
  selectedIndexRef: Ref<number> = ref(0),
  options: useActiveDescendantOptions = {}
) {
  const focusIndexRef = ref(0)
  const activeId = ref<string>('')
  const genId = useIdGenerator(options.idNamespace)

  watchEffect(() => {
    // When the focusgroup is active, we don't want to switch the index
    // as that might confuse the user currently navigating.
    // but when it's not active, and the selected index changes, we can
    // safely adjust your internal index.
    if (!isActiveRef.value) {
      focusIndexRef.value =
        selectedIndexRef?.value != null ? selectedIndexRef?.value : 0
    }
  })

  watch(activeId, id => {
    const el = elements.value[focusIndexRef.value]
    el && el.scrollIntoView() // does that make sense?
  })

  const isActiveIndex = (index: number) =>
    elements.value[index].id === activeId.value

  const containerAttrs = computed(() => {
    return {
      'aria-activedescendant': activeId,
      tabindex: 0,
      'aria-owns': elements.value.map(el => el.id).join(' '),
    }
  })
  function setActiveIdByIndex(index: number) {
    const activeId = elements.value[index] && elements.value[index].id
  }

  const forward = () => {
    let i = focusIndexRef.value + 1
    if (i >= elements.value.length && options.loop) {
      i = 0
    } else {
      i = Math.min(i, elements.value.length - 1)
    }
    setActiveIdByIndex(i)
  }
  const backward = () => {
    let i = focusIndexRef.value - 1
    if (i < 0 && options.loop) {
      i = elements.value.length - 1
    } else {
      i = Math.max(0, i)
    }
    setActiveIdByIndex(i)
  }

  const backDir = options.orientation === 'vertical' ? 'up' : 'left'
  const fwdDir = options.orientation === 'vertical' ? 'down' : 'right'

  useArrowKeys(isActiveRef, {
    [fwdDir]: forward,
    [backDir]: backward,
  })

  function handleClick(event: Event) {
    const el = event.target as HTMLElement
    el.id && (activeId.value = el.id)
  }

  return {
    // state
    containerAttrs,
    activeId: computed(() => activeId.value),

    // Fns
    genId,
    forward,
    backward,
    isActiveIndex,
    handleClick,
  }
}
