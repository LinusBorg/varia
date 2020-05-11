import { ref, reactive, computed, defineComponent, h } from 'vue'
import { TemplRef } from 'vue-aria-composables'

export function useSliderContainer() {
  const el: TemplRef = ref()

  return {
    ref: el,
    'data-varia-slider-container': true,
  }
}

type SliderContainerProps = {
  tag?: string
}

export const SliderContainer = defineComponent<SliderContainerProps>({
  setup(props, { slots }) {
    const attributes = useSliderContainer()
    return () => h(props.tag || 'DIV', attributes, slots.default?.())
  },
})
