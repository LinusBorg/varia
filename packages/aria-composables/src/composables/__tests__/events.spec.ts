import { useEvent, useEventIf } from '../events'

import { ref, nextTick } from 'vue'
import { fireEvent } from '@testing-library/dom'

describe('useEvent', () => {
  it('adds Listener', async () => {
    const el = document.createElement('button')
    const spy = jest.fn()
    const unwatch = useEvent(el, 'click', spy)
    el.click()

    await nextTick()

    expect(spy).toHaveBeenCalled()
    unwatch()
  })

  it('unwatch removes listeners', async () => {
    const el = document.createElement('button')
    const spy = jest.fn()
    const unwatch = useEvent(el, 'click', spy)
    el.click()
    unwatch()
    el.click()
    await nextTick()

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('swaps Listeners', async () => {
    const el1 = document.createElement('button')
    const el2 = document.createElement('button')
    const spy = jest.fn()
    const elRef = ref<HTMLElement>(el1)
    const unwatch = useEvent(elRef, 'click', spy)
    elRef.value.click()
    elRef.value = el2

    await nextTick()
    elRef.value.click()

    await nextTick()
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls[0][0].target).toBe(el1)
    expect(spy.mock.calls[1][0].target).toBe(el2)

    unwatch()
  })

  it('removes listeners when elRef is empty', async () => {
    const el1 = document.createElement('button')
    const el2 = document.createElement('button')
    const spy = jest.fn()
    const elRef = ref<HTMLElement | undefined>(el1)
    const unwatch = useEvent(elRef, 'click', spy)
    elRef.value!.click()

    elRef.value = undefined
    await nextTick()
    el1.click()
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)

    unwatch()
  })
})

describe('useEventIf', () => {
  it('triggers only when conditionRef is true', async () => {
    const el = document.createElement('button')
    const spy = jest.fn()
    const conditionRef = ref<boolean>(false)
    const unwatch = useEventIf(conditionRef, el, 'click', spy)

    el.click()
    await nextTick()
    expect(spy).not.toHaveBeenCalled()

    conditionRef.value = true
    await nextTick()
    el.click()
    expect(spy).toHaveBeenCalled()
    unwatch()
  })
})
