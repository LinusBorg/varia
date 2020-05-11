import { createTemplateRefList } from '../template-refs'
import { mount } from '@vue/test-utils'
import { onMounted, Ref, ref, h, defineComponent } from 'vue'
import { wait } from '../../../test/helpers'

describe('TemplateRefList', () => {
  it('works with refFn', async () => {
    let _elements!: Ref<HTMLElement[]>
    const wrapper = mount(
      defineComponent({
        setup() {
          const show = ref(false) as Ref<boolean>
          const { elements, refFn } = createTemplateRefList()
          _elements = elements
          onMounted(() => {
            show.value = true
          })
          return {
            refFn,
            show,
          }
        },
        render() {
          return [
            h('DIV', { key: 'A', ref: this.refFn }),
            this.show && h('SPAN', { key: 'B', ref: this.refFn }),
            h('DIV', { key: 'C', ref: this.refFn }),
          ].filter(Boolean)
        },
      })
    )

    // await wait()
    expect(_elements.value.length).toBe(2)
    await wait()
    expect(_elements.value.length).toBe(3)
    expect(_elements.value[2].tagName).toBe('SPAN')
  })
})
