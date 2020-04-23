import { computed, defineComponent } from 'vue'
import { useAccordionInjection } from './use-accordion'

export const AccodionPanel = defineComponent({
  name: 'AccordionPanel',
  props: {
    tag: {
      type: String,
      default: 'DIV',
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const accordionAPI = useAccordionInjection()!
    const attributes = computed(() => accordionAPI.genPanelAttrs(props.name))

    return () => h(props.tag, attributes.value)
  },
})
