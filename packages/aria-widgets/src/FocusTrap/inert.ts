import { watchEffect, Ref } from 'vue'
import { TemplRef } from '@varia/composables'

export function useInert(wrapperEl: TemplRef, isActive: Ref<boolean>) {
  watchEffect(onCleanup => {
    const { value: el } = wrapperEl
    if (el && isActive.value) {
      inert(el)
    }
    onCleanup(() => el && uninert(el))
  })
}

function inert(el: HTMLElement, set: boolean = true) {
  let ancestors: Array<HTMLElement> = [el]
  let parent: HTMLElement | null = el.parentElement
  let sibling: Element | null
  while (parent) {
    ancestors.push(parent)
    parent = parent.parentElement
  }
  for (let el of ancestors) {
    sibling = el.nextElementSibling
    if (!sibling) continue
    while (sibling) {
      set
        ? sibling.setAttribute('inert', 'true')
        : sibling.removeAttribute('inert')
      sibling = sibling.nextElementSibling
    }
    sibling = el.previousElementSibling
    if (!sibling) continue
    while (sibling) {
      set
        ? sibling.setAttribute('inert', 'true')
        : sibling.removeAttribute('inert')
      sibling = sibling.previousElementSibling
    }
  }
}
function uninert(el: HTMLElement) {
  return inert(el, false)
}
