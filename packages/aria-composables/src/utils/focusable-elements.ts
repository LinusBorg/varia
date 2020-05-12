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

export function sortByDocPosition(a: HTMLElement, b: HTMLElement) {
  return a.compareDocumentPosition(b) & 2 ? 1 : -1
}
