import { useFocusGroup } from '../focus-group'
import { provideFocusTracker } from '../focus-tracker'
import { createTemplateRefProvider } from '../template-refs'
import { wait, focus } from '../../../test/helpers'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
// setup some focusable elements in the document
const genEl = () => {
  const el = document.createElement('button')
  document.body.appendChild(el)
  return el
}
const els = Array(3)
  .fill(null)
  .map(genEl)

const outEl = genEl()

describe.skip('useFocusGroup', () => {
  it('works', async () => {
    const wrapper = mount(
      defineComponent({
        setup: () => {
          provideFocusTracker()
          const { elements, refFn } = createTemplateRefProvider()
          els.map(refFn)
          const focusGroup = useFocusGroup(elements)

          return {
            ...focusGroup,
          }
        },
        render() {
          return null
        },
      })
    )
    focus(outEl)
    await wait()
    expect(document.activeElement).toBe(outEl)
    expect(wrapper.vm.hasFocus).toBe(false)
    expect(wrapper.vm.currentEl).toBe(undefined)
    expect(wrapper.vm.currentIndex).toBe(-1)

    focus(els[0])
    await wait()
    expect(wrapper.vm.currentEl).toBe(els[0])
    expect(wrapper.vm.currentIndex).toBe(0)
    expect(wrapper.vm.hasFocus).toBe(true)
  })
})
