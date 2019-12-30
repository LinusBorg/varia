import { wait } from 'helpers'
import {
  useGlobalFocusTracker,
  provideGlobalFocusTracking,
  FocusTrackerState,
} from '../use-global-focustracker'
import { fireEvent } from '@testing-library/dom'
import { createComponent } from '@vue/composition-api'
import { mount } from '@vue/test-utils'

const focus = (el: any) => {
  ;(el as HTMLElement).focus()
  // workaround for jsdom: focus() does not trigger focusin event
  fireEvent.focusIn(el as Element)
}

describe('useGlobalFocusTracker', () => {
  it('tracks currently focussed element', async () => {
    let tracker: FocusTrackerState | undefined
    const wrapper = mount(
      createComponent({
        setup() {
          tracker = provideGlobalFocusTracking(false)
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
    wrapper.destroy()
  })

  it('tracks tabDirection', async () => {
    let tracker: FocusTrackerState | undefined
    const wrapper = mount(
      createComponent({
        setup() {
          tracker = provideGlobalFocusTracking(false)
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

    expect(tracker?.tabDirection.value).toBe(null)
    fireEvent.keyDown(document, {
      key: 'Tab',
      code: 9,
    })
    await wait()
    expect(tracker?.tabDirection.value).toBe('forward')

    fireEvent.keyDown(document, {
      key: 'Tab',
      code: 9,
      shiftKey: true,
    })
    await wait()
    expect(tracker?.tabDirection.value).toBe('backward')

    wrapper.destroy()
  })
  it('optionally provides state to children', async () => {
    let tracker: FocusTrackerState | undefined
    const wrapper = mount(
      createComponent({
        setup() {
          tracker = useGlobalFocusTracker()
          return {}
        },
      }),
      {
        parentComponent: createComponent({
          setup() {
            provideGlobalFocusTracking(true)
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

    wrapper.destroy()
  })
})
