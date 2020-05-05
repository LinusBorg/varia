import { ref, computed, watch } from 'vue'
import { TemplRef } from '../types'
import { useElementFocusObserver } from './focus-observer'
import { useArrowKeys, useKeyIf } from './keys'

export interface IArrowNavigationOptions {
  orientation: 'horizontal' | 'vertical'
  loop?: boolean
  startOnFirstSelected?: boolean
  autoSelect?: boolean
}

function getCurrentEl(el: HTMLElement) {
  const currentId = el.getAttribute('aria-activedescendant')
  if (!currentId) return

  const currentEl = document.querySelector('#' + currentId)
  /// TODO validate that element is descendant or id is in aria-owns
  if (!currentEl) {
    // TODO: throw error
    console.error(`invalid id: no element with id ${currentId} found!`)
  }

  return currentEl
}

function getChildren(el: HTMLElement, role: string) {
  const children = Array.from(el.querySelectorAll(`[role="${role}"]`))
  const owns = el.getAttribute('aria-owns')
  if (owns) {
    const ownedChildren = owns
      .split(' ')
      .map(id => document.querySelector(id))
      .filter(Boolean) as HTMLElement[]
    children.push(...ownedChildren)
  }
  return children
}

function getFirstSelectedEl(el: Element, role: string) {
  return el.querySelector(`[role="${role}"][aria-selected="true"]`)
}

export function useArrowNavigation(
  wrapperElRef: TemplRef,
  roleofChildren: string,
  options: IArrowNavigationOptions
) {
  const hasFocus = useElementFocusObserver(wrapperElRef)

  const el: TemplRef = ref()
  const id = computed(() => el.value?.id || '')
  const attributes = computed(() => ({
    tabindex: 0,
    'aria-activedescendant': id.value,
  }))

  const moveto = (to: 'next' | 'prev' | 'start' | 'end') => {
    let nextIdx: number
    const wrapperEl = wrapperElRef.value
    if (!wrapperEl) return
    const currentEl = getCurrentEl(wrapperEl)
    const children = getChildren(wrapperEl, roleofChildren)
    const max = children.length - 1

    const idx = currentEl ? children.indexOf(currentEl) : 0

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
    el.value = nextEl as HTMLElement
  }

  const click = () => el.value?.click()

  const backDir = options.orientation === 'vertical' ? 'up' : 'left'
  const fwdDir = options.orientation === 'vertical' ? 'down' : 'right'

  useArrowKeys(hasFocus, {
    [backDir]: (event: KeyboardEvent) => {
      if (event.shiftKey || event.ctrlKey) return
      console.log('arrow key')
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
        click()
        break
      default:
        return
    }
  }) as EventListener)

  watch(hasFocus, hasFocus => {
    if (!hasFocus) {
      el.value = undefined
      return
    }
    if (!wrapperElRef.value) return
    if (options.startOnFirstSelected) {
      const selectedEl = getFirstSelectedEl(wrapperElRef.value, roleofChildren)
      selectedEl && (el.value = selectedEl as HTMLElement)
    } else {
      moveto('start')
    }
  })

  return {
    id,
    attributes,
    select: (newEl: HTMLElement) => (el.value = newEl),
  }
}
