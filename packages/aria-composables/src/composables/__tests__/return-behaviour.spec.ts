import { focusTrackerKey as TrackerKey } from '../focus-tracker'
import { useReturnBehaviour } from '../return-behaviour'
import { ref, Ref, nextTick } from 'vue'
import { mount } from '../../../test/helpers'
import { fireEvent } from '@testing-library/dom'

const wait = nextTick

// setup some focusable elements in the document
const genEl = () => {
  const el = document.createElement('button')
  document.body.appendChild(el)
  return el
}
const els = Array(3)
  .fill(null)
  .map(genEl)

const mountOptions = (prevEl: Ref<HTMLElement | undefined>) => ({
  provide: {
    [TrackerKey as symbol]: {
      prevEl,
    },
  },
})

describe('useReturnBehaviour', () => {
  it.only('provides return element according to the isActive Ref flag', async () => {
    let returnBehaviour: ReturnType<typeof useReturnBehaviour> | undefined
    const isActive = ref(false)
    const prevEl = ref<HTMLElement>()
    const wrapper = mount(() => {
      returnBehaviour = useReturnBehaviour(isActive)
      return {}
    }, mountOptions(prevEl))

    expect(returnBehaviour?.returnEl.value).toBe(undefined)
    prevEl.value = els[0]
    isActive.value = true
    await wait()
    expect(returnBehaviour?.returnEl.value).toBe(els[0])

    prevEl.value = els[1]
    await wait()
    expect(returnBehaviour?.returnEl.value).toBe(els[0])

    isActive.value = false
    await wait()
    prevEl.value = els[2]
    isActive.value = true
    await wait()
    expect(returnBehaviour?.returnEl.value).toBe(els[2])

    wrapper.vm.$destroy()
  })
  it('returns to that element on unmount', async () => {
    let returnBehaviour: ReturnType<typeof useReturnBehaviour> | undefined
    const isActive = ref(true)
    const prevEl = ref<HTMLElement>(els[0])
    const wrapper = mount(() => {
      returnBehaviour = useReturnBehaviour(isActive, {
        returnOnUnmount: true,
      })
      return {}
    }, mountOptions(prevEl))

    await wait()
    expect(returnBehaviour?.returnEl.value).toBe(els[0])

    wrapper.vm.$destroy()
    await wait()
    expect(els[0]).toBe(document.activeElement)
  })
  it('returns to that element on escap key press', async () => {
    let returnBehaviour: ReturnType<typeof useReturnBehaviour> | undefined
    const isActive = ref(true)
    const prevEl = ref<HTMLElement>(els[0])
    const wrapper = mount(() => {
      returnBehaviour = useReturnBehaviour(isActive, {
        returnOnEscape: true,
      })
      return {}
    }, mountOptions(prevEl))

    await wait()
    expect(returnBehaviour?.returnEl.value).toBe(els[0])

    fireEvent.keyUp(document, {
      key: 'Escape',
      code: 27,
    })
    await wait()
    expect(els[0]).toBe(document.activeElement)

    wrapper.vm.$destroy()
  })
  it('returns to that element when return fn is called', async () => {
    let returnBehaviour: ReturnType<typeof useReturnBehaviour> | undefined
    const isActive = ref(true)
    const prevEl = ref<HTMLElement>(els[0])
    const wrapper = mount(
      () => {
        returnBehaviour = useReturnBehaviour(isActive)
        return {}
      },
      {
        provide: {
          [TrackerKey as symbol]: {
            prevEl,
          },
        },
        template: `
        <div>
          <input ref="a">
          <button ref="b">Button</button>
        </div>
        `,
        attachToDocument: true,
      }
    )
    await wait()
    expect(returnBehaviour?.returnEl.value).toBe(els[0])
    returnBehaviour?.returnFocus()
    await wait()
    expect(els[0]).toBe(document.activeElement)
  })
})
