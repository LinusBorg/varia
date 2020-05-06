import { h, defineComponent } from 'vue'
import { TeleportProps } from '../types'
export const Teleport = defineComponent(function Teleport(
  props: TeleportProps,
  { attrs, slots }
) {
  return h(
    props.tag ?? 'DIV',
    {
      'data-variant-portal': attrs.target as string,
      ...(!!props.disabled ? { style: 'display: none' } : {}),
    },
    [h('teleport', attrs, slots.default?.())]
  )
})

// @ts-ignore
Teleport.props = {
  tag: String,
}