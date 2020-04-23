import {
  computed,
  ref,
  Ref,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  watch,
  InjectionKey,
  provide,
  inject,
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
    elements,
    refFn: (el: HTMLElement) => elements.value.push(el),
  }
}

const templateRefKey = Symbol('templateRefKey') as TemplateRefKey

export function createTemplateRefProvider(
  key: TemplateRefKey = templateRefKey
) {
  const elementsFromChildren = ref<HTMLElement[]>([])
  const add = (el: HTMLElement) => elementsFromChildren.value?.push(el)
  const remove = (el: HTMLElement) => removeEl(elementsFromChildren.value, el)
  provide(key, {
    add,
    remove,
  })

  // When component updates, we slice the array
  // to trigger a re-sort in the computed prop below
  // TODO find better way to do this only when dependencies change?
  onUpdated(
    () => (elementsFromChildren.value = elementsFromChildren.value.slice())
  )

  // This ref handles elements picked directly from the template with a refFn
  const { elements: elementsFromRefs, refFn } = createTemplateRefList()

  // Then we combine both element arrays and sort the elements according
  // do their DOM position, so tab order is preserved
  const elements = computed(() => {
    return ([] as HTMLElement[])
      .concat(elementsFromChildren.value, elementsFromRefs.value)
      .sort(sortByDocPosition)
  })

  return {
    elements,
    refFn,
  }
}

export function useParentElementInjection(
  _el: Ref<HTMLElement | undefined | HTMLElement[]>,
  key: TemplateRefKey = templateRefKey
) {
  const { add, remove } = inject(key, {} as TemplateRefInjection)!
  if (!add || !remove) return // nothing provided from parent

  watch(
    _el,
    (el, _, onCleanup) => {
      if (!el) return
      Array.isArray(el) ? el.map(add) : add(el)
      onCleanup(() => (Array.isArray(el) ? el.map(remove) : remove(el)))
    },
    { immediate: true }
  )
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

function removeEl(elements: HTMLElement[] | undefined, el: HTMLElement) {
  if (!elements) return
  const i = elements.indexOf(el)
  i !== -1 && elements.splice(i, 1)
}

function sortByDocPosition(a: HTMLElement, b: HTMLElement) {
  return a.compareDocumentPosition(b) & 2 ? 1 : -1
}
