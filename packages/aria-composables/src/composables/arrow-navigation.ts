import { reactive, ref, computed, watch, Ref, onMounted, nextTick } from 'vue'
import { TemplRef, MaybeRef, ArrowNavigation } from '../types'
import { useElementFocusObserver } from './focus-observer'
import { useArrowKeys, useKeyIf } from './keys'
import { sortByDocPosition } from './template-refs'
import { useFocusGroup } from './focus-group'

import { ArrowNavigationOptions } from '../types'

/**
 * Utility to determine the first HTMLElement in an array
 * which as 'aria-selected' set to true
 *
 * @param {Set<HTMLElement>} _elements
 * @returns {HTMLElement | undefined}
 */
function getFirstSelectedEl(_elements: Set<HTMLElement>) {
  const elements = Array.from(_elements).sort(sortByDocPosition)
  return elements.find(el => el.getAttribute('aria-selected') === 'true')
}

export function useArrowNavigation(
  wrapperElRef: TemplRef,
  options: ArrowNavigationOptions
): ArrowNavigation {
  const { virtual = false } = options
  const elements = reactive(new Set<HTMLElement>())
  const elementsArray = computed(() => Array.from(elements))

  // Determine wether or not our element group has focus
  // A. if virtual: true, we only need to watch the wrapper Element because we will be using active-descendant
  // B. if virtual: false, we need to watch the individual elements because we will be using the roving tabindex pattern
  const { hasFocus } = virtual
    ? useElementFocusObserver(wrapperElRef)
    : useFocusGroup(elementsArray)

  /**
   * @function
   * Components can register their element as part of the arrow navigation
   * @param el Ref<HTMLElement> - the element that should be part of the navigation
   * @param disabled indicates wether or not this elemen is currently disabled
   */
  const addToElNavigation = (
    el: TemplRef,
    _disabled: MaybeRef<boolean> = false
  ) => {
    const disabled = ref(_disabled)
    watch(
      [el, disabled] as [TemplRef, Ref<boolean>],
      ([nextEl, nextDisabled], [prevEl]) => {
        if (nextEl && !nextDisabled) {
          elements.add(nextEl)
          return
        }
        if (nextEl && nextDisabled) {
          elements.delete(nextEl)
          return
        }
        if (prevEl && !nextEl) {
          elements.delete(prevEl)
        }
      },
      { immediate: true }
    )
  }
  // This ref will contain the element which is currently
  // "focused" by the arrow navigation
  const currentActiveElement: TemplRef = ref()
  const currentActiveId = computed(() => currentActiveElement.value?.id || '')

  // These attributes need to be applied to the wrapper Element
  // but only when using "virtual" mode
  const wrapperAttributes = virtual
    ? computed(() => ({
        tabindex: 0,
        'aria-activedescendant': currentActiveId.value,
      }))
    : ref({})

  /**
   * "moves" the aria-descendent focus by getting the next element to "focus"
   * @param {string} to 'next' | 'prev' | 'start' | 'end'
   */
  const moveto = (to: 'next' | 'prev' | 'start' | 'end') => {
    let nextIdx: number
    const children = Array.from(elements).sort(sortByDocPosition)
    const max = children.length - 1

    const idx = currentActiveElement.value
      ? children.indexOf(currentActiveElement.value)
      : 0

    switch (to) {
      case 'next':
        nextIdx = idx >= max ? (options.loop ? 0 : idx) : idx + 1
        break
      case 'prev':
        nextIdx = idx <= 0 ? (options.loop ? max : idx) : idx - 1
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
    currentActiveElement.value = nextEl as HTMLElement
    !virtual && nextEl && hasFocus.value && nextEl.focus()
  }

  const click = () => currentActiveElement.value?.click()

  const backDir = options.orientation === 'vertical' ? 'up' : 'left'
  const fwdDir = options.orientation === 'vertical' ? 'down' : 'right'

  useArrowKeys(hasFocus, {
    [backDir]: (event: KeyboardEvent) => {
      if (event.shiftKey || event.ctrlKey) return
      moveto('prev')
      options.autoSelect && click()
    },
    [fwdDir]: (event: KeyboardEvent) => {
      if (event.shiftKey || event.ctrlKey) return
      moveto('next')
      options.autoSelect && click()
    },
  })

  useKeyIf(hasFocus, ['Home', 'End', 'Enter', ' '], ((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Home':
        moveto('start')
        break
      case 'End':
        moveto('end')
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

  const determineFirstFocus = () => {
    if (options.startOnFirstSelected) {
      const selectedEl = getFirstSelectedEl(elements)
      selectedEl
        ? (currentActiveElement.value = selectedEl as HTMLElement)
        : moveto('start')
    } else {
      moveto('start')
    }
  }

  watch(hasFocus, hasFocus => {
    console.log('hasFocus Watch', hasFocus)
    if (!hasFocus) return
    determineFirstFocus()
  })

  // TODO: This could be buggy when tabs are transitioned in?
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
    select: (nextEl: HTMLElement) => void (currentActiveElement.value = nextEl),
  }
}

export function useArrowNavigationChild(
  hasFocus: Ref<boolean>,
  { virtual }: ArrowNavigation
): Ref<{
  tabindex: string
  'data-variant-focus'?: boolean
}> {
  return virtual
    ? computed(() => ({
        tabindex: '-1',
        'data-variant-focus': hasFocus.value,
      }))
    : computed(() => ({
        tabindex: hasFocus.value ? '0' : '-1',
      }))
}
