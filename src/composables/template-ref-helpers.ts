import { ref, onUpdated, Ref, onMounted } from '@vue/composition-api'

type DollarRefs = { [key: string]: Vue | Element | Vue[] | Element[] }

export function createTemplateListRef(refs: DollarRefs, name: string) {
  console.log(refs, name)
  if (!Array.isArray(refs[name])) return
  const templateRef = ref<HTMLElement[]>([])
  const handler = () => (templateRef.value = [...(<any>refs[name])])
  onUpdated(handler)
  onMounted(handler)
  return templateRef
}

export function createTemplateRef(refs: DollarRefs, names: string[]) {
  const templateRef = ref<HTMLElement[]>([])
  const handler = () => {
    const arr = names.map(n => refs[n] as HTMLElement)
    templateRef.value = arr
  }
  onMounted(handler)
  onUpdated(handler)
  return templateRef
}

const QUERY_FOCUSABLE_ELEMENTS =
  'button, [href], input, textarea, [tabindex=-1], [tabindex=0]'

export function createQueryTemplateRef(
  elRef: Ref<HTMLElement>,
  query: string = QUERY_FOCUSABLE_ELEMENTS
) {
  const templateRef = ref<HTMLElement[]>([])
  const handler = () => {
    const el = elRef.value
    if (el) {
      templateRef.value = [
        ...((el.querySelectorAll(query) as unknown) as HTMLElement[]),
      ]
    } else {
      templateRef.value = []
    }
  }
  onMounted(handler)
  onUpdated(handler)

  return templateRef
}
