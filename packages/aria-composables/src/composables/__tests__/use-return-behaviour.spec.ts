import { key as TrackerKey } from '../focus-tracker'
import { useReturnBehaviour } from '../return-behaviour'
import { ref, Ref } from 'vue'
import { mount, wait } from 'helpers'
import { fireEvent } from '@testing-library/dom'

// setup some focusable elements in the document
const genEl = () => {
  const el = document.createElement('button')
  document.body.appendChild(el)
  return el
}
const els = Array(3)
  .fill(null)
  .map(genEl)

const mountOptions = (prevEl: Ref<HTMLElement | null>) => ({
  provide: {
    [TrackerKey as symbol]: {
      prevEl,
    },
  },
  template: `
        <div>
        </div>
        `,
  attachToDocument: true,
})

describe('useReturnBehaviour', () => {
  it('provides return element according to the isActive Ref flag', async () => {
    let returnBehaviour: ReturnType<typeof useReturnBehaviour> | undefined
    const isActive = ref(false)
    const prevEl = ref<HTMLElement>(null)
    const wrapper = mount(() => {
      returnBehaviour = useReturnBehaviour(isActive)
      return {}
    }, mountOptions(prevEl))

    expect(returnBehaviour?.returnEl.value).toBe(null)
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

    wrapper.destroy()
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

    wrapper.destroy()
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

    wrapper.destroy()
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
