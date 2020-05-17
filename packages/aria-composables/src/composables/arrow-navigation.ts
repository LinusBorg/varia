import {
  reactive,
  ref,
  computed,
  watch,
  Ref,
  onMounted,
  onUnmounted,
  nextTick,
  toRefs,
} from 'vue'
import { TemplRef, MaybeRef, ArrowNavigation } from '../types'
import {
  useElementFocusObserver,
  useSelectorFocusObserver,
} from './focus-observer'
import { useArrowKeys, useKeyIf } from './keys'
import { sortByDocPosition } from '../utils/focusable-elements'

import { ArrowNavigationOptions } from '../types'
import { useReactiveDefaults } from './reactive-defaults'

/**
 * Utility to determine the first HTMLElement in an array
 * which as 'aria-selected' set to true
 *
 * @param {Set<HTMLElement>} _elementIds
 * @returns {HTMLElement | undefined}
 */
function getFirstSelectedEl(_elementIds: Array<HTMLElement>) {
  const elementIds = _elementIds.slice().sort(sortByDocPosition)
  return elementIds.find(el => el.getAttribute('aria-selected') === 'true')
}

const defaultOptions = {
  autoSelect: false,
  loop: false,
  orientation: undefined,
  startOnFirstSelected: false,
  virtual: false,
}

export function useArrowNavigation(
  options: Partial<ArrowNavigationOptions>,
  _wrapperElRef?: TemplRef
): ArrowNavigation {
  const {
    autoSelect,
    loop,
    orientation,
    startOnFirstSelected,
    virtual,
  } = useReactiveDefaults(options, defaultOptions)

  /**
   * `elementIds` is a set containing all elementIds that we want to control with arrow keys
   */
  const elementIds = reactive(new Set<string>())
  const elementIdSelector = computed(() => {
    return Array.from(elementIds)
      .map(id => '#' + id)
      .join(',')
  })
  const elementsFromIds = () => {
    const selector = elementIdSelector.value
    const els =
      selector.length > 0
        ? (Array.from(document.querySelectorAll(selector)) as HTMLElement[])
        : []
    return els
  }
  // `currentActiveElement` will contain the element which is currently
  // "focused" by the arrow navigation
  const currentActiveId = ref('')
  const currentActiveElement = computed(() => {
    return currentActiveId.value.length > 0
      ? (document.querySelector('#' + currentActiveId.value) as HTMLElement)
      : undefined
  })

  const wrapperElRef = _wrapperElRef || ref()
  // wrapperAttributes need to be applied to the wrapper Element
  // but only when using "virtual" mode
  // TODO: pull this out into its own use* composable
  const wrapperAttributes = computed(() => {
    return virtual.value
      ? {
          ref: wrapperElRef,
          tabindex: 0,
          'aria-activedescendant': currentActiveId.value,
          onClick: ({ target }: { target: Element }) =>
            target &&
            target.id &&
            elementIds.has(target.id) &&
            (currentActiveId.value = target.id),
        }
      : {}
  })
  // Determine wether or not our element group has focus
  //  A. if virtual: true, we only need to watch the wrapper Element because we will be using active-descendant
  //  B. if virtual: false, we need to watch the individual elementIds because we will be using the roving tabindex pattern
  const virtualObserver = useElementFocusObserver(wrapperElRef)
  const selectorObserer = useSelectorFocusObserver(elementIdSelector)
  const hasFocus = computed(() => {
    return virtual.value
      ? virtualObserver.hasFocus.value
      : selectorObserer.hasFocus.value
  })

  /**
   * @function
   * Components can register their element as part of the arrow navigation
   * This function controls the content of `elementIds`
   * @param el Ref<HTMLElement> - the element that should be part of the navigation
   * @param disabled indicates wether or not this elemen is currently disabled
   */
  const addToElNavigation = (
    id: string,
    _disabled: MaybeRef<boolean | undefined> = false
  ) => {
    const disabled = ref(_disabled)
    watch(
      disabled,
      nextDisabled => {
        !nextDisabled ? elementIds.add(id) : elementIds.delete(id)
      },
      { immediate: true }
    )
    onUnmounted(() => elementIds.delete(id))
  }

  /**
   * - Determines the next element to focus within the group of `elementIds`
   * @param {string} to 'next' | 'prev' | 'start' | 'end'
   */
  const moveto = (to: 'next' | 'prev' | 'start' | 'end') => {
    let nextIdx: number
    const children = elementsFromIds()
    const max = children.length - 1

    const idx = currentActiveId.value
      ? children.findIndex(el => el.id === currentActiveId.value)
      : 0

    switch (to) {
      case 'next':
        nextIdx = idx >= max ? (loop.value ? 0 : idx) : idx + 1
        break
      case 'prev':
        nextIdx = idx <= 0 ? (loop.value ? max : idx) : idx - 1
        break
      case 'start':
        nextIdx = 0
        break
      case 'end':
        nextIdx = max
        break
      default:
        throw new Error()
    }

    const nextEl = children[nextIdx]
    if (nextEl) {
      currentActiveId.value = nextEl.id
    }
    !virtual.value && nextEl && hasFocus.value && nextEl.focus()
  }

  /**
   * Listeners for the actual arrow Navigation
   */
  const backward = (event: KeyboardEvent) => {
    if (event.shiftKey || event.ctrlKey) return
    moveto('prev')
    autoSelect.value && click()
  }
  const forward = (event: KeyboardEvent) => {
    if (event.shiftKey || event.ctrlKey) return
    moveto('next')
    autoSelect.value && click()
  }
  const click = () => currentActiveElement.value?.click()
  useArrowKeys(
    hasFocus,
    {
      up: backward,
      down: forward,
      right: forward,
      left: backward,
    },
    reactive({ orientation })
  )

  useKeyIf(hasFocus, ['Home', 'End', 'Enter', ' '], ((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Home':
        moveto('start')
        autoSelect.value && click()
        break
      case 'End':
        moveto('end')
        autoSelect.value && click()
        break
      case 'Enter':
      case ' ':
        // when using virtual mode, we need to simulate a click on the "focused" argument
        virtual.value && click()
        break
      default:
        return
    }
  }) as EventListener)

  /**
   * Determines which of the `elementIds` should be the first one to receive focus
   * when the tab sequence reaches out composite widge
   */
  const determineFirstFocus = () => {
    if (startOnFirstSelected.value) {
      const selectedEl = getFirstSelectedEl(elementsFromIds())
      selectedEl
        ? (currentActiveId.value = selectedEl.id || '')
        : moveto('start')
    } else {
      moveto('start')
    }
  }

  watch(hasFocus, active => {
    if (active) return
    determineFirstFocus()
  })

  onMounted(() => {
    nextTick(() => {
      determineFirstFocus()
    })
  })

  return {
    hasFocus,
    currentActiveElement,
    currentActiveId,
    virtual,
    wrapperAttributes,
    // Methods
    addToElNavigation,
    select: (nextEl: HTMLElement) => void (currentActiveId.value = nextEl.id),
  }
}

export function useArrowNavigationChild(
  hasFocus: Ref<boolean>,
  { virtual }: ArrowNavigation
): Ref<{
  tabindex: string | undefined
  'data-varia-focus'?: boolean
}> {
  return computed(() => {
    return virtual.value
      ? {
          tabindex: undefined,
          'data-varia-focus': hasFocus.value,
        }
      : {
          tabindex: hasFocus.value ? '0' : '-1',
        }
  })
}
