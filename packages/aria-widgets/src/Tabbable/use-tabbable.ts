import { computed, reactive, ref } from 'vue'
import { useEvent } from 'vue-aria-composables'

export interface TabbableOptions {
  disabled?: boolean
  focusable?: boolean
  tabIndex?: number | string
  onClick?: <T extends any>(e: T) => any
  onMouseDown?: <T extends any>(e: T) => any
  [key: string]: any
}

const defaults = {
  disabled: false,
  focusable: true,
}

export function useTabbable(_options: Partial<TabbableOptions> = {}) {
  const options = reactive(Object.assign({}, defaults, _options))

  const trulyDisabled = computed(() => options.disabled && !options.focusable)

  const el = ref<HTMLElement>()

  const preventDefaults = (e: Event): true | undefined => {
    if (options.disabled) {
      e.stopImmediatePropagation()
      e.stopPropagation
      e.preventDefault()
      return true
    }
    return undefined
  }
  const onClick = (event: Event) => preventDefaults(event) || el.value?.click
  useEvent(el, 'mouseDown', preventDefaults, { capture: true, passive: true })
  useEvent(el, 'click', onClick, { capture: true, passive: true })

  return {
    ref: el,
    tabIndex: options.tabIndex || 0,
    disabled: trulyDisabled.value,
    'aria-disabled': options.disabled,
  }
}
