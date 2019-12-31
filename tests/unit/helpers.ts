import Vue from 'vue'
import { mount as _mount } from '@vue/test-utils'
import { VNode, CreateElement } from 'vue/types/umd'
import { fireEvent } from '@testing-library/dom'
type SetupFn = (...args: any[]) => Record<string, any>

export const focus = (el: any) => {
  ;(el as HTMLElement).focus()
  // workaround for jsdom: focus() does not trigger focusin event
  fireEvent.focusIn(el as Element)
}

export async function wait(n?: number) {
  if (!n) return Vue.nextTick()

  return new Promise(res => setTimeout(res, n))
}
export function mount(setup: SetupFn, options?: any) {
  const component = {
    setup,
    render: options.tempate
      ? undefined
      : function(h: CreateElement): VNode {
          return h()
        },
  }
  return _mount(component, options)
}

const Parent = {
  setup() {
    const provideGlobalFocusTracking = require('../../src/composables/use-global-focustracker')
      .provideGlobalFocusTracking

    provideGlobalFocusTracking()
  },
  render(h: CreateElement): VNode {
    return h()
  },
}

export function mountWithTrackerParent(setup: SetupFn, options: any) {
  return mount(setup, {
    ...options,
    parentComponent: Parent,
  })
}
