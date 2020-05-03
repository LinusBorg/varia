import {
  computed,
  ref,
  reactive,
  Ref,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  watch,
  InjectionKey,
  provide,
  inject,
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

const templateRefKey = Symbol('templateRefKey') as TemplateRefKey

export function createTemplateRefProvider(
  key: TemplateRefKey = templateRefKey
) {
  const elements = ref<HTMLElement[]>([])
  const add = (el: HTMLElement) => elements.value?.push(el)
  const remove = (el: HTMLElement) => removeEl(elements.value, el)
  provide(key, {
    add,
    remove,
  })

  // When component updates, we slice the array
  // to trigger a re-sort in the computed prop below
  // TODO find better way to do this only when dependencies change?
  onUpdated(() => (elements.value = elements.value.slice()))

  // This ref handles elements picked directly from the template with a refFn
  const { elements: elementsFromRefs, refFn } = createTemplateRefList()

  // Then we combine both element arrays and sort the elements according
  // do their DOM position, so tab order is preserved
  const sortedElements = computed(() => {
    return ([] as HTMLElement[])
      .concat(elements.value, elementsFromRefs.value)
      .sort(sortByDocPosition)
  })

  return {
    elements: sortedElements,
    refFn,
  }
}

export function createTemplateRefAPI<Item = any>() {
  const elements = ref(new Set<HTMLElement>())
  const elementsToItems = reactive(new Map<HTMLElement, Item>())
  const itemsToElements = reactive(new Map<Item, HTMLElement>())
  const add = (el: HTMLElement, item?: Item) => {
    elements.value.add(el)
    if (item) {
      elementsToItems.set(el, item)
      itemsToElements.set(item, el)
    }
  }
  const remove = (el: HTMLElement) => {
    elements.value.delete(el)
    if (elementsToItems.has(el)) {
      const item = elementsToItems.get(el)
      !!item && itemsToElements.delete(item)
      elementsToItems.delete(el)
    }
  }

  // When component updates, we slice the array
  // to trigger a re-sort in the computed prop below
  // TODO find better way to do this only when dependencies change?
  onUpdated(() => (elements.value = new Set(elements.value)))

  // Then we combine both element arrays and sort the elements according
  // do their DOM position, so tab order is preserved
  const sortedElements = computed(() => {
    return readonly(Array.from(elements.value).sort(sortByDocPosition))
  })

  return {
    elements: sortedElements,
    add,
    remove,
    elementsToItems: readonly(elementsToItems),
    itemsToElements: readonly(itemsToElements),
  }
}

export function useParentElementInjection(
  _el: Ref<HTMLElement | undefined | HTMLElement[]>,
  key: TemplateRefKey = templateRefKey
) {
  const { add, remove } = inject(key, {} as TemplateRefInjection)!
  if (!add || !remove) {
    console.error(`Couldn\'T find expected injection.
    This likely means that you  didn't call a use*() hook in the parent as you should`)
  } // nothing provided from parent

  watch(
    _el,
    (el, _, onCleanup) => {
      if (!el) return
      if (el) Array.isArray(el) ? el.map(add) : add(el)
      onCleanup(() => el && (Array.isArray(el) ? el.map(remove) : remove(el)))
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
