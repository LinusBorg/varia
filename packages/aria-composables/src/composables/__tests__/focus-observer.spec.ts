import { useElementFocusObserver } from '../focus-observer'
import { TemplRef } from '../../types'
import { ref, nextTick } from 'vue'
import { fireEvent } from '@testing-library/dom'

describe('Focus Observers', () => {
  const addEl = (name = 'BUTTON', id = 'id') => {
    const el = document.createElement(name)
    el.setAttribute('id', id)
    document.body.append(el)
  }
  beforeEach(() => {
    addEl()
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })
  it('useElementFocusObserver', async () => {
    const el = document.getElementById('id')
    if (!el) throw new Error('element not found')
    const elRef: TemplRef = ref()
    const { hasFocus } = useElementFocusObserver(elRef)

    expect(hasFocus.value).toBe(false)
    fireEvent.focus(el)
    fireEvent.focusIn(el)
    elRef.value = el
    await nextTick()
    expect(hasFocus.value).toBe(true)
  })
})
