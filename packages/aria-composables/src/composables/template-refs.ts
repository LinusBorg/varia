import {
  ref,
  Ref,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  watch,
  InjectionKey,
  readonly,
} from 'vue'

interface TemplateRefInjection {
  add: (el: HTMLElement) => void
  remove: (el: HTMLElement) => void
}

export type TemplateRefKey = InjectionKey<TemplateRefInjection>

export function createTemplateRefList() {
  const elements = ref<HTMLElement[]>([])

  onBeforeUpdate(() => (elements.value = []))
  return {
    elements: readonly(elements),
    refFn: (el: HTMLElement) => void elements.value.push(el),
  }
}

const QUERY_FOCUSABLE_ELEMENTS =
  'button, [href], input, textarea, [tabindex], audio, video'

export function createTemplateRefQuery(
  elRef: Ref<HTMLElement>,
  query: string = QUERY_FOCUSABLE_ELEMENTS
) {
  const elements = ref<HTMLElement[]>([])
  const handler = () => {
    const el = elRef.value
    if (el) {
      elements.value = [
        ...((el.querySelectorAll(query) as unknown) as HTMLElement[]),
      ]
    } else {
      elements.value = []
    }
  }
  watch(elRef, handler)
  onMounted(handler)
  onUpdated(handler)

  return elements
}
