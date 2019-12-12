import { computed, ref, Ref, watch } from '@vue/composition-api'
import { useArrowKeys } from './use-arrow-keys'
import { useIdGenerator } from './use-id-generator'

interface useActiveDescendantOptions {
  idNamespace?: string
  loop?: boolean
  orientation?: 'vertical' | 'horizontal'
}

export function useActiveDescendant(
  templateRefs: Ref<HTMLElement[]>,
  conditionRef: Ref<boolean>,
  options: useActiveDescendantOptions = {}
) {
  const indexRef = ref(0)
  const activeId = ref<string>(null)
  const genId = useIdGenerator(options.idNamespace)

  watch(activeId, id => {
    const el = templateRefs.value[indexRef.value]
    el && el.scrollIntoView() // does that make sense?
  })

  const isActiveIndex = (index: number) =>
    templateRefs.value[index].id === activeId.value

  const containerAttrs = computed(() => {
    return {
      'aria-activedescendant': activeId,
      tabindex: 0,
      'aria-owns': templateRefs.value.map(el => el.id).join(' '),
    }
  })
  function setActiveIdByIndex(index: number) {
    const activeId = templateRefs.value[index] && templateRefs.value[index].id
  }

  const forward = () => {
    let i = indexRef.value + 1
    if (i >= templateRefs.value.length && options.loop) {
      i = 0
    } else {
      i = Math.min(i, templateRefs.value.length - 1)
    }
    setActiveIdByIndex(i)
  }
  const backward = () => {
    let i = indexRef.value - 1
    if (i < 0 && options.loop) {
      i = templateRefs.value.length - 1
    } else {
      i = Math.max(0, i)
    }
    setActiveIdByIndex(i)
  }

  const backDir = options.orientation === 'vertical' ? 'up' : 'left'
  const fwdDir = options.orientation === 'vertical' ? 'down' : 'right'

  useArrowKeys(conditionRef, {
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
