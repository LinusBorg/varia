import { ref, Ref, onBeforeUpdate, onMounted, onUpdated, watch } from 'vue'

export function createTemplateRefList<El extends HTMLElement>() {
  const elements = ref<El[]>([])

  onBeforeUpdate(() => (elements.value = []))
  return (el: El) => elements.value.push(el)
}

const QUERY_FOCUSABLE_ELEMENTS = 'button, [href], input, textarea, [tabindex]'

export function createTemplateRefQuery<El extends HTMLElement>(
  elRef: Ref<El>,
  query: string = QUERY_FOCUSABLE_ELEMENTS
) {
  const elements = ref<El[]>([])
  const handler = () => {
    const el = elRef.value
    if (el) {
      elements.value = [...((el.querySelectorAll(query) as unknown) as El[])]
    } else {
      elements.value = []
    }
  }
  watch(elRef, handler)
  onMounted(handler)
  onUpdated(handler)

  return elements
}
