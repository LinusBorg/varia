import { defineComponent, PropType, h } from 'vue'
import { ComponentAPIKey, ComponentAPI } from "../types";
import { injectComponentAPI } from './useComponent'

interface ComponentOptions {

}

export function useComponent(
  options: ComponentOptions = {}
  Api: ComponentAPI,
) {
  const api = injectComponentAPI()

  return api
}

export const componentProps = {
  tag: {
    type: String,
    default: 'DIV',
  },
  apiKey: {
    type: Symbol as PropType<ComponentAPIKey>,
  },
}

export const Component = defineComponent({
  name: 'Component',
  props: componentProps,
  setup(props, { slots }) {
    const api = injectComponentAPI(props.apiKey)
    const attributes = useComponent(props, api)
    return () => h(props.tag ?? 'DIV', attributes.value, slots.default?.({ attributes: attributes.value}))
  },
})