import { VueConstructor } from 'vue'
import { isRef, ref } from '@vue/composition-api'
import { MaybeRef } from '../types'

export const wrap = <T>(value: MaybeRef<T>) =>
  isRef(value) ? value : ref<T>(value)
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

export function applyFocus(
  _el: HTMLElement | InstanceType<VueConstructor>
): boolean {
  // if it's a Vue Component Instance ...
  if ((_el as any)._isVue) {
    const vm = _el as InstanceType<VueConstructor>
    if (applyFocus(vm.$el as HTMLElement)) {
      return true
    } else {
      const el2 = vm.$el.querySelector(
        `button, [href], input, select, textarea, [tabindex=0],[tabindex=-1])`
      )
      if (!el2) return false
      return applyFocus(el2 as HTMLElement)
    }
  }
  // else, it's an Element
  const el = _el as HTMLElement
  const _isFocusable = isFocusable(el)
  if (_isFocusable) {
    el.focus()
  } else {
    console.warn('Trying to set focus to non-focusable element: ', el)
  }
  return _isFocusable
}
