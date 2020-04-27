import { useIndexMover } from '../index-mover'
describe('useIndexMover', () => {
  it('works with defaults', () => {
    const items = [1, 2, 3]
    const mover = useIndexMover(items)

    // verify API
    expect(mover).toMatchObject({
      selectedIndex: {
        value: expect.any(Number),
      },
      forward: expect.any(Function),
      backward: expect.any(Function),
      setIndex: expect.any(Function),
    })

    expect(mover.selectedIndex.value).toBe(0)
    mover.forward()
    expect(mover.selectedIndex.value).toBe(1)
    mover.forward()
    expect(mover.selectedIndex.value).toBe(2)
    mover.forward()
    expect(mover.selectedIndex.value).toBe(2)
    mover.backward()
    mover.backward()
    mover.backward()
    expect(mover.selectedIndex.value).toBe(0)
    mover.setIndex(1)
    expect(mover.selectedIndex.value).toBe(1)
    mover.setIndex(5)
    expect(mover.selectedIndex.value).toBe(1)
    mover.setIndex(-2)
    expect(mover.selectedIndex.value).toBe(1)
  })

  it('loops when loop option is set', () => {
    const items = [1, 2, 3]
    const mover = useIndexMover(items, { loop: true })

    expect(mover.selectedIndex.value).toBe(0)
    mover.forward()
    mover.forward()
    expect(mover.selectedIndex.value).toBe(2)
    mover.forward()
    expect(mover.selectedIndex.value).toBe(0)
    mover.backward()
    expect(mover.selectedIndex.value).toBe(2)
  })
})
