import { useArrowKeys, useKeyIf } from '../keys'
import { ref } from 'vue'
import { fireEvent } from '@testing-library/dom'

const pressUp = () =>
  fireEvent.keyUp(document, {
    key: 'Up',
    code: 38,
  })
const pressDown = () =>
  fireEvent.keyUp(document, {
    key: 'Down',
    code: 40,
  })
const pressLeft = () =>
  fireEvent.keyUp(document, {
    key: 'Left',
    code: 37,
  })
const pressRight = () =>
  fireEvent.keyUp(document, {
    key: 'Right',
    code: 39,
  })

describe('useKeyIf', () => {
  it('triggers on keyboard keyup events if conditionRef = true', async () => {
    const conditionRef = ref<boolean>(true)
    const spy = jest.fn()
    const unwatch = useKeyIf(conditionRef, ['Up'], spy)

    fireEvent.keyUp(document, {
      key: 'Up',
      code: 38,
    })
    fireEvent.keyUp(document, {
      key: 'Down',
      code: 40,
    })
    expect(spy).toHaveBeenCalledTimes(1)
    conditionRef.value = false
    fireEvent.keyUp(document, {
      key: 'Up',
      code: 38,
    })
    expect(spy).toHaveBeenCalledTimes(1)
    unwatch()
  })
})

describe('useArrowKeys', () => {
  it('triggers handlers for correct Keys if conditionRef = true', () => {
    const conditionRef = ref<boolean>(true)
    const spies = {
      up: jest.fn().mockName('up'),
      down: jest.fn().mockName('down'),
      left: jest.fn().mockName('left'),
      right: jest.fn().mockName('right'),
    }
    const unwatch = useArrowKeys(conditionRef, {
      up: spies.up,
      down: spies.down,
      left: spies.left,
      right: spies.right,
    })

    pressUp()
    pressDown()
    pressLeft()
    pressRight()
    // fire unrelate key
    fireEvent.keyUp(document, {
      key: 'Enter',
      code: 13,
    })
    expect(spies.up).toHaveBeenCalledTimes(1)
    expect(spies.down).toHaveBeenCalledTimes(1)
    expect(spies.left).toHaveBeenCalledTimes(1)
    expect(spies.right).toHaveBeenCalledTimes(1)
    conditionRef.value = false
    pressUp()
    expect(spies.up).toHaveBeenCalledTimes(1)
  })
})
