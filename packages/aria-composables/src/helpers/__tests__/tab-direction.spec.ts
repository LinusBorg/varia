import { wait } from '../../../test/helpers'
import { fireEvent } from '@testing-library/dom'
import { tabDirection } from '../tab-direction'

describe('Tab Direction', () => {
  it('tracks tabDirection', async () => {
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
