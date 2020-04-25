import { wait } from '../../../test/helpers'
import { fireEvent } from '@testing-library/dom'
import { mount } from '@vue/test-utils'
import { useTabDirection, provideTabDirection } from '../tab-direction'

describe('Tab Direction', () => {
  it('tracks tabDirection', async () => {
    let tabDirection!: ReturnType<typeof useTabDirection>
    const wrapper = mount(
      {
        setup() {
          provideTabDirection()
          tabDirection = useTabDirection()
          return {}
        },
        template: `<div>
                <input ref="a">
                <button ref="b">Test me</button>
              </div>`,
      },
      {
        attachTo: document.body,
      }
    )

    expect(tabDirection.value).toBe(null)
    fireEvent.keyDown(document, {
      key: 'Tab',
      code: 9,
    })
    await wait()
    expect(tabDirection.value).toBe('forward')

    fireEvent.keyDown(document, {
      key: 'Tab',
      code: 9,
      shiftKey: true,
    })
    await wait()
    expect(tabDirection.value).toBe('backward')

    // @ts-ignore
    wrapper.vm.$destroy()
  })
})
