import {
  reactive,
  ref,
  computed,
  watch,
  Ref,
  onMounted,
  onUnmounted,
  nextTick,
  readonly,
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
import { useEventIf } from './events'

/**
 * Utility to determine the first HTMLElement in an array
 * which as 'aria-selected' set to true
 *
 * @param {Set<HTMLElement>} _elementIds
 * @returns {HTMLElement | undefined}
 */
function getFirstSelectedElement(_elementIds: Array<HTMLElement>) {
  const elementIds = _elementIds.slice().sort(sortByDocPosition)
  return elementIds.find(el => el.getAttribute('aria-selected') === 'true')
}

/**
 * Gets elements for the elementIds we have
 * @param selector {string} CSS selector of all the ids of elements in the nav.
 */
function elementsFromIds(selector: string) {
  const els =
    selector.length > 0
      ? (Array.from(document.querySelectorAll(selector)) as HTMLElement[])
      : []
  return els
}

/**
 * This function creates an aPI for us to track which element ids are
 * currentply part of the navigation, and add new ids to this group.
 *
 * @returns {object} elementIdsAPI
 * @property {Set<string>} elementIdsAPI.elementIds Set of all ids
 * @property {Ref<string>} elementIdsAPI.elementIdSelector CSS selector built from ids
 * @property {function} elementIdsAPI.addIdToNavigation add id string to the Set
 */
function createElementIdState() {
  const elementIds = reactive(new Set<string>())
  const elementIdSelector = computed(() => {
    return Array.from(elementIds)
      .map(id => '#' + id)
      .join(',')
  })
  const addIdToNavigation = (
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
  return {
    elementIds: readonly(elementIds),
    elementIdSelector: readonly(elementIdSelector),
    addIdToNavigation,
  }
}

const defaultOptions: ArrowNavigationOptions = {
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

  // state and methods to work with element id selectors of children
  const {
    elementIds,
    elementIdSelector,
    addIdToNavigation,
  } = createElementIdState()

  // The id of the child element that is considered active and will receive focus
  // if the user navigates to this navigation's group of elements
  const currentActiveId = ref('')
  const currentActiveElement = computed(() => {
    return currentActiveId.value.length > 0
      ? (document.querySelector('#' + currentActiveId.value) as HTMLElement)
      : undefined
  })

  // Determine wether or not our group has Focus
  //  A. if virtual: true, we only need to watch the wrapper Element
  //     because we will be using active - descendant
  //  B. if virtual: false, we need to watch the individual elementIds
  //     because we will be using the roving tabindex pattern
  const wrapperElRef = _wrapperElRef || ref()
  const virtualObserver = useElementFocusObserver(wrapperElRef)
  const selectorObserer = useSelectorFocusObserver(elementIdSelector)
  const hasFocus = computed(() => {
    return virtual.value
      ? virtualObserver.hasFocus.value
      : selectorObserer.hasFocus.value
  })

  /**
   * - Determines the next element to focus within the group of `elementIds`
   * @param {string} to 'next' | 'prev' | 'start' | 'end'
   */
  const moveto = (to: 'next' | 'prev' | 'start' | 'end') => {
    let nextIdx: number
    const children = elementsFromIds(elementIdSelector.value)
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
    if (nextEl === currentActiveElement.value) return
    if (nextEl) {
      currentActiveId.value = nextEl.id
    }
    !virtual.value && nextEl && hasFocus.value && nextEl.focus()
  }

  /**
   * Listeners for doing the actual arrow navigation
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
        // when using virtual mode, we need to do a click on the "focused" argument
        virtual.value && click()
        break
      default:
        return
    }
  }) as EventListener)

  const virtualAndHasFocus = computed(() => virtual.value && hasFocus.value)
  useEventIf(virtualAndHasFocus, document, 'keydown', ((
    event: KeyboardEvent
  ) => {
    if (event.key === ' ') {
      console.log('prevented space scroll!')
      event.preventDefault()
    }
  }) as EventListener)
  /**
   * Determines which of the `elementIds` should be the first one to receive focus
   * when the tab sequence reaches out composite widge
   */
  const determineFirstFocus = () => {
    if (startOnFirstSelected.value) {
      const selectedEl = getFirstSelectedElement(
        elementsFromIds(elementIdSelector.value)
      )
      selectedEl
        ? (currentActiveId.value = selectedEl.id || '')
        : moveto('start')
    } else {
      moveto('start')
    }
  }

  // whenever we lose focus, we should determine
  // on which element focus should start again
  // when the user returns
  watch(hasFocus, active => {
    if (active) return
    determineFirstFocus()
  })

  // ... and we should do the same check on mounted
  onMounted(() => {
    nextTick(() => {
      determineFirstFocus()
    })
  })

  return {
    hasFocus,
    elementIds: elementIds as Set<string>,
    currentActiveElement,
    currentActiveId,
    virtual,
    // Methods
    addIdToNavigation,
    select: (id: string) => void (currentActiveId.value = id),
    wrapperElRef,
  }
}
export function useArrowNavWrapper(api: ArrowNavigation) {
  // wrapperAttributes need to be applied to the wrapper Element
  // but only when using "virtual" mode
  // TODO: pull this out into its own use* composable
  return computed(() => {
    return api.virtual.value
      ? {
          ref: api.wrapperElRef,
          tabindex: 0,
          'aria-owns': Array.from(api.elementIds as Set<string>).join(','),
          'aria-activedescendant': api.currentActiveId.value,
        }
      : {}
  })
}

export function useArrowNavigationItem(
  {
    id,
    isDisabled,
  }: {
    id: string
    isDisabled: Ref<boolean>
  },
  api: ArrowNavigation
): Ref<{
  tabindex: string | undefined
  'data-varia-focus'?: boolean
  onClick: () => void
}> {
  api.addIdToNavigation(id, isDisabled)

  const hasFocus = computed(() => id === api.currentActiveId.value)

  const onClick = () => {
    !isDisabled.value && api.select(id)
  }
  return computed(() => {
    return api.virtual.value
      ? {
          tabindex: undefined,
          'data-varia-focus': hasFocus.value,
          onClick,
        }
      : {
          tabindex: hasFocus.value ? '0' : '-1',
          onClick,
        }
  })
}
