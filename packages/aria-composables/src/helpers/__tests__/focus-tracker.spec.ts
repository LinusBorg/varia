import { focusTracker } from '../focus-tracker'
import { fireEvent } from '@testing-library/dom'
import { nextTick } from 'vue'
describe('Focus Tracker', () => {
  const addEl = (id = 'id', name = 'BUTTON') => {
    const el = document.createElement(name)
    el.setAttribute('id', id)
    document.body.append(el)
  }
  beforeEach(() => {
    addEl()
    addEl('id2')
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })
  it('works', async () => {
    const el = document.getElementById('id')
    if (!el) throw new Error('element not found')
    const el2 = document.getElementById('id')
    if (!el2) throw new Error('element not found')

    expect(focusTracker.currentEl.value).toBe(undefined)
    expect(focusTracker.activeEl.value).toBe(document.body)
    expect(focusTracker.prevEl.value).toBe(undefined)

    fireEvent.focus(el)
    fireEvent.focusIn(el)
    await nextTick()
    expect(focusTracker.currentEl.value).toBe(el)
    expect(focusTracker.activeEl.value).toBe(el)
    expect(focusTracker.prevEl.value).toBe(document.body)

    fireEvent.focus(el2)
    fireEvent.focusIn(el2)
    await nextTick()
    expect(focusTracker.currentEl.value).toBe(el2)
    expect(focusTracker.activeEl.value).toBe(el2)
    expect(focusTracker.prevEl.value).toBe(el)
  })
})
