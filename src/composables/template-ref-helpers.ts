import {
  ref,
  onUpdated,
  Ref,
  onMounted,
  onBeforeUpdate,
} from '@vue/composition-api'

type DollarRefs = { [key: string]: Vue | Element | Vue[] | Element[] }

export function createTemplateRefFn(cb?: (el: HTMLElement) => any) {
  const elements = ref<HTMLElement[]>([])
  let cache: HTMLElement[] = []

  onBeforeUpdate(() => (cache = []))
  onMounted(() => (elements.value = cache))
  onUpdated(() => (elements.value = cache))

  const fn = (el: HTMLElement) => {
    cache.push(el)
    // if we need to do something else with the el, we can pass in a callback
    cb && cb(el)
  }

  return {
    elements,
    fn,
  }
}
export function createTemplateRefDynamic(
  refs: DollarRefs,
  names: string | string[]
) {
  if (Array.isArray(names)) {
    return createTemplateRef(refs, names)
  } else {
    return createTemplateListRef(refs, names)
  }
}

export function createTemplateListRef(refs: DollarRefs, name: string) {
  console.log(refs, name)
  if (!Array.isArray(refs[name])) {
    throw new Error(
      'createTemplateListRef expects an array ref, got a single element ref'
    )
  }
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
