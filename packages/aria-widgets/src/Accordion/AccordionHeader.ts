import { computed, defineComponent, Ref, ref, h, watch } from 'vue'
import { useParentElementInjection } from 'vue-aria-composables'
import { useAccordionInjection } from './use-accordion'
import { Button } from '../Button'

export function useAccordionHeader() {}

export const AccordionHeader = defineComponent({
  name: 'AccordionHeader',
  props: {
    tag: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
    },
  },
  setup(props, { slots }) {
    // Local State
    const accordionAPI = useAccordionInjection()!
    const isOpen = ref<boolean>(false) as Ref<boolean>
    const handleClick = () => {
      if (props.disabled) return
      isOpen.value = !isOpen.value
    }
    // Sync state with useAccordion in parent
    watch(isOpen, _isOpen => {
      accordionAPI.set(props.name, _isOpen)
    })
    watch(
      () => accordionAPI.state[props.name],
      isActive => {
        isOpen.value = isActive
      }
    )

    // Integrate into keyboard navigation
    const el = ref<HTMLElement>()
    useParentElementInjection(el)

    // Generate attributes for the button
    const attributes = computed(() => ({
      ...accordionAPI.genHeaderAttrs(
        accordionAPI.generateId(props.name),
        accordionAPI.state[name],
        !!props.disabled
      ),
      onClick: handleClick,
      tag: props.tag,
    }))
    if (!accordionAPI) {
      throw Error(
        `<AccordionHeader />: useAccordion() was not called in any parent`
      )
    }
    return () => {
      return slots.replace
        ? slots.replace(attributes.value)
        : h(Button, attributes.value, slots.default?.(attributes.value))
    }
  },
})
