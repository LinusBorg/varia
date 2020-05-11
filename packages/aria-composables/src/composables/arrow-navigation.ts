import {
  reactive,
  ref,
  computed,
  watch,
  Ref,
  onMounted,
  onUnmounted,
  nextTick,
} from 'vue'
import { TemplRef, MaybeRef, ArrowNavigation } from '../types'
import {
  useElementFocusObserver,
  useSelectorFocusObserver,
} from './focus-observer'
import { useArrowKeys, useKeyIf } from './keys'
import { sortByDocPosition } from '../utils/focusable-elements'

import { ArrowNavigationOptions } from '../types'

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

export function useArrowNavigation(
  options: ArrowNavigationOptions,
  _wrapperElRef?: TemplRef
): ArrowNavigation {
  const {
    autoSelect,
    loop,
    orientation,
    startOnFirstSelected,
    virtual = false,
  } = options

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
  const wrapperAttributes = virtual
    ? computed(() => ({
        ref: wrapperElRef,
        tabindex: 0,
        'aria-activedescendant': currentActiveId.value,
        onClick: ({ target }: { target: Element }) =>
          target &&
          target.id &&
          elementIds.has(target.id) &&
          (currentActiveId.value = target.id),
      }))
    : ref({})
  // Determine wether or not our element group has focus
  //  A. if virtual: true, we only need to watch the wrapper Element because we will be using active-descendant
  //  B. if virtual: false, we need to watch the individual elementIds because we will be using the roving tabindex pattern
  const { hasFocus } = virtual
    ? useElementFocusObserver(wrapperElRef)
    : useSelectorFocusObserver(elementIdSelector)

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
        nextIdx = idx >= max ? (loop ? 0 : idx) : idx + 1
        break
      case 'prev':
        nextIdx = idx <= 0 ? (loop ? max : idx) : idx - 1
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
    !virtual && nextEl && hasFocus.value && nextEl.focus()
  }

  /**
   * Listeners for the actual arrow Navigation
   */
  const backDir = orientation === 'vertical' ? 'up' : 'left'
  const fwdDir = orientation === 'vertical' ? 'down' : 'right'
  const click = () => currentActiveElement.value?.click()

  useArrowKeys(hasFocus, {
    [backDir]: (event: KeyboardEvent) => {
      if (event.shiftKey || event.ctrlKey) return
      moveto('prev')
      autoSelect && click()
    },
    [fwdDir]: (event: KeyboardEvent) => {
      if (event.shiftKey || event.ctrlKey) return
      moveto('next')
      autoSelect && click()
    },
  })

  useKeyIf(hasFocus, ['Home', 'End', 'Enter', ' '], ((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Home':
        moveto('start')
        autoSelect && click()
        break
      case 'End':
        moveto('end')
        autoSelect && click()
        break
      case 'Enter':
      case ' ':
        // when using virtual mode, we need to simulate a click on the "focused" argument
        virtual && click()
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
    if (startOnFirstSelected) {
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
  return virtual
    ? computed(() => ({
        tabindex: undefined,
        'data-varia-focus': hasFocus.value,
      }))
    : computed(() => ({
        tabindex: hasFocus.value ? '0' : '-1',
      }))
}
