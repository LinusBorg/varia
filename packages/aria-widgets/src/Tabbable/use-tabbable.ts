import { computed, reactive, ref, Ref, PropType, watchEffect } from 'vue'
import { useEvent } from 'vue-aria-composables'
import { isNativeTabbable } from '../utils/elements'
export interface TabbableOptions {
  disabled?: boolean | undefined
  focusable?: boolean | undefined
  onClick?: <T extends any>(e: T) => any
  onMouseDown?: <T extends any>(e: T) => any
  [key: string]: any
}

export const TabbableProps = {
  disabled: {
    type: Boolean as PropType<boolean>,
  },
  focusable: {
    type: Boolean as PropType<boolean>,
  },
}

const defaults = {
  disabled: false,
  focusable: undefined,
}

export function useTabbable(
  _options: Partial<TabbableOptions> = {},
  _el?: Ref<HTMLElement | undefined>
) {
  const options = reactive(Object.assign({}, defaults, _options))

  const el = _el || ref<HTMLElement>()

  const preventDefaults = (e: Event): true | undefined => {
    if (options.disabled) {
      e.stopImmediatePropagation()
      e.stopPropagation()
      e.preventDefault()
      return true
    }
    return undefined
  }
  const onClick = (event: Event) => preventDefaults(event) || el.value?.focus()
  useEvent(el, 'mouseDown', preventDefaults, { capture: true })
  useEvent(el, 'mouseOver', preventDefaults, { capture: true })
  useEvent(el, 'click', onClick, { capture: true })

  // I'd rather do this the "right" way: returning it as an attirbute from this funcion
  // but it depends on wether the element's tagName which we only know after initial render,
  // when the `el` ref has been populated.
  // so we do it imperatively here:
  watchEffect(() => {
    const rawEl = el.value
    if (!rawEl) return
    if (!isNativeTabbable(rawEl)) return
    rawEl.disabled = options.disabled && !options.focusable
  })

  return computed(() => ({
    ref: el,
    tabIndex: !options.disabled ? 0 : options.focusable ? -1 : undefined,
    'aria-disabled': options.disabled || undefined,
  }))
}
