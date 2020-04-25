import { wait, focus } from 'helpers'
import { useFocusTracker, provideFocusTracker } from '../focus-tracker'
import { useTabDirection, provideTabDirection } from '../tab-direction'
import { fireEvent } from '@testing-library/dom'
import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'

describe('useFocusTracker', () => {
  it('tracks currently focussed element', async () => {
    let tracker!: ReturnType<typeof useFocusTracker>
    const wrapper = mount(
      {
        template: `<div>
                <input ref="a">
                <button ref="b">Test me</button>
              </div>`,
        setup() {
          provideFocusTracker()
          tracker = useFocusTracker()
          const a = ref<HTMLElement>()
          return { a }
        },
      },
      {
        attachTo: document.querySelector('body') as HTMLElement,
      }
    )
    await wait()
    focus(wrapper.vm.$refs.a)
    await wait()
    expect(tracker?.currentEl.value).toBe(wrapper.vm.$refs.a)
    expect(tracker?.activeEl.value).toBe(wrapper.vm.$refs.a)
    expect(tracker?.prevEl.value).toBe(document.body)

    focus(wrapper.vm.$refs.b)
    await wait()
    expect(tracker?.currentEl.value).toBe(wrapper.vm.$refs.b)
    expect(tracker?.activeEl.value).toBe(wrapper.vm.$refs.b)
    expect(tracker?.prevEl.value).toBe(wrapper.vm.$refs.a)

    // we need to manually unmount the component since we attached to the document.
    //@ts-ignore
    wrapper.vm.$destroy()
  })

  it('tracks tabDirection', async () => {
    let tabDirection!: ReturnType<typeof useTabDirection>
    const wrapper = mount(
      defineComponent({
        setup() {
          provideTabDirection()
          tabDirection = useTabDirection()
          return {}
        },
      }),
      {
        template: `<div>
                <input ref="a">
                <button ref="b">Test me</button>
              </div>`,
        attachToDocument: true,
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
  it('optionally provides state to children', async () => {
    let tracker!: ReturnType<typeof useFocusTracker>
    const wrapper = mount(
      defineComponent({
        setup() {
          tracker = useFocusTracker()
          return {}
        },
      }),
      {
        parentComponent: defineComponent({
          setup() {
            provideFocusTracker()
            return {}
          },
        }),
        template: `<div>
                <input ref="a">
                <button ref="b">Test me</button>
              </div>`,
        attachToDocument: true,
      }
    )
    expect(tracker).toBeDefined()
    expect(tracker?.activeEl.value).toBe(document.body)
    focus(wrapper.vm.$refs.a)
    await wait()
    expect(tracker?.currentEl.value).toBe(wrapper.vm.$refs.a)

    // @ts-ignore
    wrapper.vm.$destroy()
  })
})
