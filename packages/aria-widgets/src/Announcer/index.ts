import {
  h,
  defineComponent,
  PropType,
  readonly,
  Ref,
  ref,
  nextTick,
  App,
} from 'vue'

const announcerId = Symbol('announcer')

export function createAnnouncer() {
  function useAnnouncer() {
    const message: Ref<string> = ref('')
    const set = (newMessage: string) => {
      message.value = ''
      nextTick(() => (message.value = newMessage))
    }

    return {
      message: readonly(message),
      set,
    }
  }

  const Announcer = defineComponent({
    props: {
      tag: String,
      assertive: Boolean as PropType<boolean>,
      visuallyHidden: {
        type: Boolean as PropType<boolean>,
        default: true,
      },
    },
    name: 'Announcer',
    setup(props) {
      const { message } = useAnnouncer()
      return () =>
        h(
          props.tag || 'SPAN',
          {
            'data-varia-visually-hidden': props.visuallyHidden,
            'aria-live': props.assertive ? 'assertive' : 'polite',
          },
          message.value
        )
    },
  })

  return {
    useAnnouncer,
    Announcer,
  }
}

// Create Detault composable & component
const { useAnnouncer, Announcer } = createAnnouncer()

//Plugin function
// function install(app: App) {
//   app.config.globalProperties['$announce'] = useAnnouncer().set
//   app.component('Announcer', Announcer)
// }

export { useAnnouncer, Announcer }
