# `@varia/composables`

> This package is part of the varia project, a collection of Vue 3 components that provide unstyled, but fully accessible building blocks for popular UI concepts.

## What This Is

The `composables` package is kind of the core package of `@varia`. It provides a set of lower-level composables and utility functions that the actual component packages can build upon to implement their logic.

As such, it's listed as a `dependency` for pretty much every component package in this monorepo.

## Provided Functionality

Composables:

- track focus of a single element or a group of elements
- track tab direction
- track keybord events and call functions when specific conditions are met
- arrow navigation primitives (both for "roving tabindex" and `aria-activedescendant` patterns)
- track clicks outside of an element

Utilities:

- id helpers: generate random ids and cache them for re-use
- query helpers to find focusable elements in various ways and situations (i.e. "get the first focusable Element that is a descendant of `provided element`")
- a small set of reactivity helpers to improve writing of composition functions.
