import {
  useParentElementInjection,
  createTemplateRefProvider,
  createTemplateRefList,
} from '../template-refs'
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

const Child = defineComponent({
  setup() {
    const el = ref<HTMLElement>()
    useParentElementInjection(el)

    return { el }
  },
  render() {
    return h('SPAN', { ref: _el => (this.el = _el as HTMLElement) })
  },
})
const Parent = defineComponent({
  components: {
    Child,
  },
  setup() {
    const showChild = ref(false) as Ref<boolean>
    onMounted(() => {
      showChild.value = true
    })
    const { elements, refFn } = createTemplateRefProvider()
    return {
      elements,
      refFn,
      showChild,
    }
  },
  render() {
    return [
      h('DIV', { key: 'A', ref: this.refFn }),
      this.showChild && h(Child),
      h('DIV', { key: 'C', ref: this.refFn }),
    ].filter(Boolean)
  },
})

describe.only('TemplateRefProvider', () => {
  it('can be used like createTemplateRefList', async () => {
    const wrapper = mount(Parent)
    // await wait()
    expect(wrapper.vm.elements.length).toBe(2)
  })
  it('can have els added & removed by children', async () => {
    const wrapper = mount(Parent)
    expect(wrapper.vm.elements.length).toBe(2)
    await wait(1000)
    expect(wrapper.vm.elements.length).toBe(3)
    expect(wrapper.vm.elements[1].tagName).toBe('SPAN')
  })
})
