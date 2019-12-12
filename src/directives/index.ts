// in Vue 3, we can do all of that within the templataeRef Fn, maybe?
import Vue from 'vue'
import { applyFocus } from '../utils'

const handler = (event: Event) => {
  const el = event.target as HTMLElement
  if (el.tabIndex !== -1 && el.tabIndex !== 0) {
    el.tabIndex = -1
  }
  el.focus()
}
export const focusOnClick = {
  bind: (el: HTMLElement) => {
    el.addEventListener('click', handler)
  },
  updated: (el: HTMLElement) => {
    if (el.tabIndex !== -1 && el.tabIndex !== 0) {
      el.tabIndex = -1
    }
  },
  unbind: (el: HTMLElement) => el.removeEventListener('click', handler),
}

export const autofocus = {
  bind: async (el: HTMLElement) => {
    await Vue.nextTick()
    if (el.tabIndex !== -1 && el.tabIndex !== 0) {
      el.tabIndex = -1
    }
    applyFocus(el)
  },
}
