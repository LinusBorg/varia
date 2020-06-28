import { defineComponent, reactive, nextTick, ref } from 'vue'

import { useReactiveDefaults } from '../reactive-defaults'

const defaults = {
  a: 'A',
  b: 'B',
  c: 'C',
}

describe('useReactiveDefaults', () => {
  it('works with reactive', async () => {
    const original = reactive({
      a: 'AA',
      b: 'B',
    })

    const obj = useReactiveDefaults(original, defaults)

    expect(obj.a.value).toBe('AA')
    expect(obj.b.value).toBe('B')
    expect(obj.c.value).toBe('C')
    original.a = 'AAA'
    await nextTick()
    expect(obj.a.value).toBe('AAA')
  })
})
