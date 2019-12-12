import { isRef, ref, Ref, onUpdated, onMounted } from '@vue/composition-api'
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
  return el.isConnected && (focusables.includes(el.tag) || el.tabIndex >= -1)
}

export function applyFocus(el: HTMLElement) {
  const _isFocusable = isFocusable(el)
  if (_isFocusable) {
    el.focus()
  } else {
    console.warn('Trying to set focus to non-focusable element: ', el)
  }
  return _isFocusable
}

type DollarRefs = {
  [key: string]: HTMLElement | Array<HTMLElement>
}

export function createTemplateListRef(refs: DollarRefs, name: string) {
  if (!Array.isArray(refs[name])) return
  const templateRef = ref<HTMLElement[]>([])
  onUpdated(() => (templateRef.value = [...(<any>refs[name])]))
  return templateRef
}

const QUERY_FOCUSABLE_ELEMENTS =
  'button, [href], input, textarea, [tabindex=-1], [tabindex=0]'

export function createQueryTemplateRef(
  elRef: Ref<HTMLElement>,
  query: string = QUERY_FOCUSABLE_ELEMENTS
) {
  const templateRef = ref<HTMLElement[]>([])
  const handler = () => {
    const el = elRef.value
    if (el) {
      templateRef.value = [
        ...((el.querySelectorAll(query) as unknown) as HTMLElement[]),
      ]
    } else {
      templateRef.value = []
    }
  }
  onMounted(handler)
  onUpdated(handler)

  return templateRef
}
