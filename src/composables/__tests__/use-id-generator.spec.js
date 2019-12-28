import { useIdGenerator } from '../use-id-generator'

describe('UseIdGenerator', () => {
  it('returns a function', () => {
    const idGen = useIdGenerator()
    expect(typeof idGen).toBe('function')
  })

  it('generates a stable id-string for a given name', () => {
    const idGen = useIdGenerator()
    const id = idGen('test')
    expect(typeof id).toBe('string')
    expect(id).toBe(idGen('test'))
  })

  it('generates different ids for different names', () => {
    const idGen = useIdGenerator()
    const id1 = idGen('1')
    const id2 = idGen('2')
    expect(id1 !== id2).toBe(true)
  })

  it('add prefix when given as argument to factory', () => {
    const idGen = useIdGenerator('prefix')
    const id = idGen('test')
    expect(/^prefix_.+/.test(id)).toBe(true)
  })
})
