import { isRef, ref } from 'vue'
import { MaybeRef } from '../types'

export * from './id-generator'

export const wrap = <T>(value: MaybeRef<T>) =>
  isRef(value) ? value : ref(value)
export const unwrap = <T>(value: MaybeRef<T>) =>
  isRef<T>(value) ? value.value : value

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

const focusableEls = [
  'a',
  'button',
  'input',
  'textarea',
  'iframe',
  'object',
  'embed',
]

function isFocusable(el: HTMLElement) {
  if (!el.isConnected) return false
  if (!focusableEls.includes(el.tagName) && !el.contentEditable) return false
  if ((el as HTMLInputElement).disabled) return false
  return true
}

export function applyFocus(_el: HTMLElement): boolean {
  // else, it's an Element
  const el = _el
  const _isFocusable = isFocusable(el)
  if (_isFocusable) {
    el.focus()
  } else {
    console.warn('Trying to set focus to non-focusable element: ', el)
  }
  return _isFocusable
}
