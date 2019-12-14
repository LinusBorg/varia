export * from './composables/template-ref-helpers'
export * from './composables/use-global-focustracker'

export * from './composables/use-focus-group'
// export * from './composables/use-activedescendant'
export * from './composables/use-roving-index'

// export * from './composables/use-focustrap'

// export * from './composables/use-arrow-keys'
export * from './composables/use-events'
// export * from './composables/use-id-generator'
// export * from './composables/use-focus-elref'

declare module '@vue/composition-api/dist/component/component' {
  interface SetupContext {
    readonly refs: { [key: string]: Vue | Element | Vue[] | Element[] }
  }
}
