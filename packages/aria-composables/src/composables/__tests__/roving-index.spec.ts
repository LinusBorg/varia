import { useRovingTabIndex } from '../roving-index'
import { fireEvent } from '@testing-library/dom'
import { ref, Ref, nextTick as wait } from 'vue'
const addEl = (tag: string = 'DIV') => {
  const el = document.createElement(tag)
  el.tabIndex = -1
  document.body.append(el)
  return el
}
describe('useRovingIndex', () => {
  let els: HTMLElement[]
  beforeEach(() => {
    document.body.innerHTML = ''
    els = [1, 2, 3].map(() => addEl())
  })
  it('works programmatically', async () => {
    const isActive = ref(true) as Ref<boolean>
    const rover = useRovingTabIndex(ref(els), isActive)

    expect(els[0].tabIndex).toBe(-1)
    expect(els[1].tabIndex).toBe(-1)
    expect(els[2].tabIndex).toBe(-1)

    // Move forward once
    rover.forward()
    await wait()
    // expect(els[0].tabIndex).toBe(-1)
    // expect(els[1].tabIndex).toBe(0)
    // expect(els[2].tabIndex).toBe(-1)
    expect(document.activeElement).toBe(els[1])

    // Move forward so it loops back to the beginning
    rover.forward()
    await wait()
    rover.forward()
    await wait()
    expect(document.activeElement).toBe(els[0])

    // move backward
    rover.backward()
    await wait()
    rover.backward()
    await wait()
    expect(document.activeElement).toBe(els[1])

    // don't move if rover is not active
    isActive.value = false
    rover.forward()
    await wait()
    expect(document.activeElement).toBe(els[1])
  })

  it('halts at outer bounds if loop: false', async () => {
    const isActive = ref(true) as Ref<boolean>
    const rover = useRovingTabIndex(ref(els), isActive, {
      loop: false,
    })

    rover.forward()
    await wait()
    rover.forward()
    await wait()
    rover.forward()
    await wait()
    expect(document.activeElement).toBe(els[2])
  })

  it('works with keyboard navigation: vertical', async () => {
    const isActive = ref(true) as Ref<boolean>
    const rover = useRovingTabIndex(ref(els), isActive, {
      loop: false,
    })

    fireEvent.keyUp(document, { key: 'ArrowDown', code: 'ArrowDown' })
    await wait()
    expect(document.activeElement).toBe(els[1])
    fireEvent.keyUp(document, { key: 'ArrowUp', code: 'ArrowUp' })
    await wait()
    expect(document.activeElement).toBe(els[0])
  })

  it('works with keyboard navigation: horizontal', async () => {
    const isActive = ref(true) as Ref<boolean>
    const rover = useRovingTabIndex(ref(els), isActive, {
      loop: false,
      orientation: 'horizontal',
    })

    fireEvent.keyUp(document, { key: 'ArrowRight', code: 'ArrowRight' })
    await wait()
    expect(document.activeElement).toBe(els[1])
    fireEvent.keyUp(document, { key: 'ArrowLeft', code: 'ArrowLeft' })
    await wait()
    expect(document.activeElement).toBe(els[0])

    isActive.value = false
    fireEvent.keyUp(document, { key: 'ArrowLeft', code: 'ArrowLeft' })
    await wait()
    expect(document.activeElement).toBe(els[0])
  })

  it('Home skips to first element', async () => {
    const isActive = ref(true) as Ref<boolean>
    const rover = useRovingTabIndex(ref(els), isActive, {
      loop: false,
      orientation: 'horizontal',
    })

    rover.focusByIndex(2)
    await wait()

    fireEvent.keyUp(document, { key: 'Home', code: 'Home' })
    await wait()
    expect(document.activeElement).toBe(els[0])
  })

  it('End skips to last element', async () => {
    const isActive = ref(true) as Ref<boolean>
    const rover = useRovingTabIndex(ref(els), isActive, {
      loop: false,
      orientation: 'horizontal',
    })

    fireEvent.keyUp(document, { key: 'End', code: 'End' })
    await wait()
    expect(document.activeElement).toBe(els[2])
  })
})
