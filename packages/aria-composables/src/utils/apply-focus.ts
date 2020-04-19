import { isFocusable } from './focusable-elements'
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
