import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { wait } from '../../../test/helpers'
import { fireEvent } from '@testing-library/dom'
import { useTabDirection, provideTabDirection } from '../tab-direction'

describe('Tab Direction', () => {
  it('tracks tabDirection', async () => {
    let tabDirection!: ReturnType<typeof useTabDirection>
    const wrapper = mount(
      defineComponent({
        setup() {
          provideTabDirection()
          tabDirection = useTabDirection()
          return {}
        },
        render() {
          return [h('input'), h('button', ['Test me'])]
        },
      })
    )

    expect(tabDirection.value).toBe(undefined)
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
  })
})
