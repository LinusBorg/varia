import { applyFocus } from './apply-focus'

const focusableElList = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'embed',
  'iframe',
  'input:not([disabled])',
  'object',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '*[tabindex]',
  '*[contenteditable]',
]

const TABBABLE_ELS = focusableElList.join(',')

export function getFocusableElements(
  el: HTMLElement,
  query: string = TABBABLE_ELS
) {
  return Array.from(el.querySelectorAll(query)) as HTMLElement[]
}

export function getFirstFocusableChild(wrapperEl: HTMLElement) {
  const els = getFocusableElements(wrapperEl)
  console.log('getFirstFocusableChild', els)
  return els.length ? els[0] : undefined
}
export function getLastFocusableChild(wrapperEl: HTMLElement) {
  const els = getFocusableElements(wrapperEl)
  console.log('getLastFocusableChild', els)
  return els.length ? els[els.length - 1] : undefined
}

export function getNextFocusableElement(
  wrapperEl: HTMLElement,
  el: HTMLElement,
  query: string = TABBABLE_ELS
) {
  const els = getFocusableElements(wrapperEl, query)
  const i = els.indexOf(el)
  if (i === els.length) {
    return els[0]
  }
  return i !== -1 ? els[i + 1] : undefined
}
export function getPreviousFocusableElement(
  wrapperEl: HTMLElement,
  el: HTMLElement,
  query: string = TABBABLE_ELS
) {
  const els = getFocusableElements(wrapperEl, query)
  const i = els.indexOf(el)
  if (i === 0) {
    return els[els.length - 1]
  }
  return i !== -1 ? els[i - 1] : undefined
}

export function moveFocusToNextElement(el: HTMLElement) {
  if (el.matches(TABBABLE_ELS)) applyFocus(el)
  const nextEl = el.querySelector(TABBABLE_ELS)
  nextEl && applyFocus(nextEl as HTMLElement)
}

export function sortByDocPosition(a: HTMLElement, b: HTMLElement) {
  return a.compareDocumentPosition(b) & 2 ? 1 : -1
}
