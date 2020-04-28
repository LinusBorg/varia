import { wait, focus } from '../../../test/helpers'
import {
  useFocusTracker,
  provideFocusTracker,
  state as tracker,
} from '../focus-tracker'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

describe('useFocusTracker', () => {
  // setup some focusable elements in the document

  it('tracks currently focussed element', async () => {
    const genEl = () => {
      const el = document.createElement('button')
      document.body.appendChild(el)
      return el
    }
    const els = Array(3)
      .fill(null)
      .map(genEl)

    const outEl = genEl()
    focus(els[0])
    expect(tracker.currentEl.value).toBe(els[0])
    expect(tracker.activeEl.value).toBe(els[0])
    expect(tracker.prevEl.value).toBe(document.body)

    focus(els[1])
    expect(tracker.currentEl.value).toBe(els[1])
    expect(tracker.activeEl.value).toBe(els[1])
    expect(tracker.prevEl.value).toBe(els[0])
  })

  it.skip('provide and inject serve correct API', async () => {
    const genEl = () => {
      const el = document.createElement('button')
      document.body.appendChild(el)
      return el
    }
    const els = Array(3)
      .fill(null)
      .map(genEl)

    const wrapper = mount(
      defineComponent({
        setup: () => {
          provideFocusTracker()
          const tracker = useFocusTracker()
          return {
            ...tracker,
          }
        },
        render() {
          return null
        },
      })
    )
    await wait()
    focus(document.body)
    expect(wrapper.vm).toHaveProperty('currentEl', document.body)
    focus(els[0])
    await wait()
    expect(wrapper.vm).toHaveProperty('currentEl', els[0])
    expect(wrapper.vm).toHaveProperty('activeEl', els[0])
    expect(wrapper.vm).toHaveProperty('prevEl', document.body)
  })
})
