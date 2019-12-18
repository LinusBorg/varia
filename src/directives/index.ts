// in Vue 3, we can do all of that within the templataeRef Fn, maybe?
import Vue, { DirectiveOptions } from 'vue'
import { applyFocus } from '../utils'

const keyToClickHandlers = new Map()
export const keyToClick: DirectiveOptions = {
  bind: (el, { modifiers }) => {
    const handleKeyToClick = (event: KeyboardEvent) => {
      const key = event.key
      switch (key) {
        case ' ':
          modifiers.space && el.click()
          break
        case 'enter':
          modifiers.enter && el.click()
          break
        default:
          return
      }
    }
    el.addEventListener('keyup', e => handleKeyToClick)
    keyToClickHandlers.set(el, handleKeyToClick)
  },
  unbind: el => {
    const handler = keyToClickHandlers.get(el)
    el.removeEventListener('keyup', e => handler)
  },
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
