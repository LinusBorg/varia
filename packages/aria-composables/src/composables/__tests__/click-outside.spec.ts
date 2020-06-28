import { defineComponent, ref, nextTick } from 'vue'
import { TemplRef } from '../../types'
import { useClickOutside } from '../click-outside'
import { mount } from '@vue/test-utils'

describe('Click Outside', () => {
  const template = `
    <div>
      <button id="outside_button" ref="outsideBtn">Click!</button>
      <div id="wrapper" ref="wrapper">
        <button id="inside_button" ref="insideBtn">Click!</button>
      </div>
    </div>
  `

  const createComponent = (spy: (...args: any[]) => any) =>
    defineComponent({
      template,
      setup() {
        const insideBtn: TemplRef = ref()
        const outsideBtn: TemplRef = ref()
        const wrapper: TemplRef = ref()

        useClickOutside([wrapper], spy)
        return {
          insideBtn,
          outsideBtn,
          wrapper,
        }
      },
    })

  it('works', async () => {
    const spy = jest.fn()
    const spy2 = jest.fn()
    const component = createComponent(spy)
    const wrapper = mount(component, {
      attachTo: document.body,
    })
    document.addEventListener('click', spy2)
    await nextTick()
    await nextTick()

    const elInner = document.getElementById('inside_button')
    expect(elInner).toBeDefined()
    elInner?.click()
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(0)

    const elOuter = document.getElementById('outside_button')
    expect(elOuter).toBeDefined()
    elOuter?.click()
    await nextTick()

    expect(spy2).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
