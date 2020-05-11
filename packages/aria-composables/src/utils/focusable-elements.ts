import { applyFocus } from './apply-focus'

const ALL_TABBABLE = `a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]`
// const ALL_FOCUSABLE = `a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [tabindex="1"] [contenteditable]`

export function getFocusableElements(
  el: HTMLElement,
  query: string = ALL_TABBABLE
) {
  return Array.from(el.querySelectorAll(query)) as HTMLElement[]
}

export function getNextFocusableElement(
  wrapperEl: HTMLElement,
  el: HTMLElement,
  query: string = ALL_TABBABLE
) {
  const els = getFocusableElements(wrapperEl, query)
  const i = els.indexOf(el)
  return i !== -1 ? els[i + 1] : undefined
}
export function getPreviousFocusableElement(
  wrapperEl: HTMLElement,
  el: HTMLElement,
  query: string = ALL_TABBABLE
) {
  const els = getFocusableElements(wrapperEl, query)
  const i = els.indexOf(el)
  return i !== -1 ? els[i + 1] : undefined
}

export function moveFocusToNextElement(el: HTMLElement) {
  if (el.matches(ALL_TABBABLE)) applyFocus(el)
  const nextEl = el.querySelector(ALL_TABBABLE)
  nextEl && applyFocus(nextEl as HTMLElement)
}

export function sortByDocPosition(a: HTMLElement, b: HTMLElement) {
  return a.compareDocumentPosition(b) & 2 ? 1 : -1
}

// const focusableEls = [
//   'a',
//   'button',
//   'input',
//   'textarea',
//   'iframe',
//   'object',
//   'embed',
// ]
