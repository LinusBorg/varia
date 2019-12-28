export * from './widgets'
export * from './composables'
export * from './directives'
export * from './types'

declare module '@vue/composition-api/dist/component/component' {
  interface SetupContext {
    readonly refs: { [key: string]: Vue | Element | Vue[] | Element[] }
  }
}
