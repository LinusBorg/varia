import { isRef, ref } from 'vue'
import { MaybeRef } from '../types'

export const wrap = <T>(value: MaybeRef<T>) =>
  isRef(value) ? value : ref(value)
export const unwrap = <T>(value: MaybeRef<T>) =>
  isRef<T>(value) ? value.value : value

const focusables = ['a', 'button', 'input', 'textarea', 'iframe']

export function isVisible(el: HTMLElement) {
  return (
    el.style.visibility !== 'hidden' &&
    el.style.display !== 'none' &&
    el.offsetHeight > 0 &&
    el.offsetWidth > 0
  )
}

function isFocusable(el: HTMLElement) {
  return (
    el.isConnected && (focusables.includes(el.tagName) || el.tabIndex >= -1)
  )
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
