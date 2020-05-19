# vue-aria

> WAI-ARIA compliant components that come without any styles, plus lower-level utility composables.
> Meant as a base for building your own component collection while ensuring solid A11y from the get-go.

## WARNING: EXPERIMENTAL

This project is currently at an exploratory/experimental stage in its development.
We are still in the process of figuring out the patterns and designed APIs suited for those patterns.

- APIs will change frequently and without notice.
- Many things don't work, and if they do, might break easily.
- Even more things are still completely missing.

So:

- If you want to contribute to the project, please see [the "For Developers" Notes](#for-developers).
- If you want to use this already: don't.

## Documentation

- Source: see `./packages/docs`
- Live: _TBD_

## Installation

```javascript
import { createApp } from 'vue'
// import the plugin
import { install as plugin } from '@varia/widgets'

import App from './App.vue'

createApp(App)
  .use(plugin) // add the plugin to your app
  .mount('#app')
```

## State of Development

<!-- markdownlint-disable MD033 -->
<details>
  <summary>Click here to the the state of development</summary>

### Basics

#### `<Clickable />`

- [x] Implementation
- ~~Examples~~
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Tabbable />`

- [x] Implementation
- ~~Examples~~
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Button />`

- [x] Implementation
- [x] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Radio />`

- [ ] Implementation
- [ ] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Checkbox />`

- [ ] Implementation
- [ ] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

### Showing and Hiding Stuff

#### `<Disclosure />`

- [x] Implementation
- [x] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Popover />`

- [ ] Implementation
- [ ] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Dialog />`

- [x] Implementation
- [x] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Accordion />`

- [x] Implementation
- [x] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Tabs />`

- [x] Implementation
- [x] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

### Structured Data

#### `<Listbox />`

- [x] Implementation
- [x] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Grid />`

- [ ] Implementation
- [ ] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<ComboBox />`

- [ ] Implementation
- [ ] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Menu />`

- [ ] Implementation
- [ ] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Toolbar />`

- [ ] Implementation
- [ ] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

### Special-Purpose

#### `<FocusTrap />`

- [x] Implementation
- [x] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

#### `<Teleport />`

- [x] Implementation
- [ ] Examples
- [ ] Documentation
- [ ] Unit Tests
- [ ] E2e Tests

</details>

## Usage

### Tabs Component

```html
<template>
  <h2 class="text-xl font-bold mb-2">Basic</h2>
  <Tabs v-model="selectedTab">
    <TabList class="border-b border-gray-300">
      <Tab name="A">Tab A</Tab>
      <Tab name="B">Tab B</Tab>
      <Tab name="C">Tab C</Tab>
    </TabList>
    <TabPanel name="A">Panel A</TabPanel>
    <TabPanel name="B">Panel B</TabPanel>
    <TabPanel name="C">Panel C</TabPanel>
  </Tabs>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import { Tab, TabList, TabPanel, useTabs } from '@varia/widgets'

  export default defineComponent({
    components: {
      Tab,
      TabList,
      TabPanel,
    },
    data() {
      return {
        selectedTab: 'A',
      }
    },
  })
</script>
```

This gives you:

- a fully functional Tabs UI.
- which is completely unstyled.
- yet fully accessible (WAI-ARIA 1.2 spec-compliant)
- commuication between `useTabs()`, `<Tab>` and `<TabPanel>` abstracted away through `provide/inject`

### Customizing through composition

- _TBD_

### Using a lower-level composable

- _TBD_

## Aknowledgements

I've studied other projects that share the same or or a similar close in my endavour, some more closely than others. If I took anything specific from them you'll find mentions in the source.

Projects:

- Vuetensils
- Reach-UI
- Reakit

## For Developers

This project is set up as a monorepo using lerna and yarn workspaces. For this reason, yarn is required to contribute to this project, all found in the `./packages` directory.

- `@varia/composables`: a suppor package providing lower-level composables, upon which the components in `aria-widgets` are built. Can be used standalone as well.
- `@varia/widgets`: the main package, exporting all of the components.
- `docs`: the project's documentation, built with [Vuepress](vuepress.vuejs.org)
- `examples`: a Vue CLI app containing examples for all of the components from `aria-widgets`. used for e2e tests

For more information on how to contribute, please see [the contribution guide](./github/CONTRIBUTING.md)
