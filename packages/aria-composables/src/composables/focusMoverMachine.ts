import { useMachine } from '../utils/use-machine'
import { assign, StateMachine } from '@xstate/fsm'
import { computed, Ref, watch } from 'vue'

// https://xstate.js.org/viz/?gist=55f5c4b2daf92698f987192bb30f97ad

const context = {
  active: false,
  selectedIndex: 0,
  max: Infinity,
}

type Context = typeof context

type FocusMoverEvents =
  | ACTIVATE
  | DEACTIVATE
  | FORWARD
  | BACKWARD
  | { type: '' }
  | UPDATE_MAX
  | UPDATE_INDEX

type ACTIVATE = { type: 'ACTIVATE' }
type DEACTIVATE = { type: 'DEACTIVATE' }
type BACKWARD = { type: 'BACKWARD' }
type FORWARD = { type: 'FORWARD' }
type UPDATE_MAX = {
  type: 'UPDATE_MAX'
  max: number
}
type UPDATE_INDEX = {
  type: 'UPDATE_INDEX'
  index: number
}

type FocusMoverState =
  | {
      value: 'inactive'
      context: Context & { active: false }
    }
  | {
      value: 'unknown'
      context: Context
    }
  | {
      value: 'active'
      context: Context & { active: true }
    }

const machine: StateMachine.Config<Context, FocusMoverEvents> = {
  id: 'focusMover',
  initial: 'unknown',
  context,
  states: {
    unknown: {
      on: {
        '': [
          {
            target: 'active',
            cond: ctx => ctx.active,
          },
          {
            target: 'inactive',
          },
        ],
      },
    },
    inactive: {
      on: {
        ACTIVATE: 'active',
        UPDATE_MAX: {
          actions: 'updateMax',
        },
        UPDATE_INDEX: {
          actions: 'updateIndex',
        },
      },
    },
    active: {
      entry: 'setActive',
      exit: 'setInactive',
      on: {
        DEACTIVATE: 'inactive',
        FORWARD: {
          actions: ['forward'],
        },
        BACKWARD: {
          actions: 'backward',
        },
        UPDATE_MAX: {
          actions: 'updateMax',
        },
        UPDATE_INDEX: {
          actions: 'updateIndex',
        },
      },
    },
  },
}

const actions = {
  setActive: assign<Context, ACTIVATE>({
    active: true,
  }),
  setInactive: assign<Context, DEACTIVATE>({
    active: false,
  }),
  backward: assign<Context, BACKWARD>({
    selectedIndex: ctx => Math.max(0, ctx.selectedIndex - 1),
  }),
  forward: assign<Context, FORWARD>({
    selectedIndex: ctx => Math.min(ctx.max, ctx.selectedIndex + 1),
  }),
  updateMax: assign<Context, UPDATE_MAX>({
    max: (_, evt) => evt.max,
    selectedIndex: (ctx, evt) => Math.min(ctx.selectedIndex, evt.max),
  }),
  updateIndex: assign<Context, UPDATE_INDEX>({
    selectedIndex: (_, { index }) => index,
  }),
}

export function useFocusMoverMachine(
  elements: Ref<HTMLElement[]>,
  initialContext?: Partial<Context>
) {
  const { service, state } = useMachine<
    Context,
    FocusMoverEvents,
    FocusMoverState
  >(
    initialContext
      ? {
          ...machine,
          context: {
            ...machine.context,
            ...(initialContext as Context),
          },
        }
      : machine,
    {
      actions,
    }
  )

  watch(elements, els =>
    service.send({
      type: 'UPDATE_MAX',
      max: els.length,
    })
  )

  return {
    service,
    selectedIndex: computed(() => state.value.context.selectedIndex),
    forward: () => service.send('FORWARD'),
    backward: () => service.send('BACKWARD'),
    setIndex: (index: number) =>
      service.send({
        type: 'UPDATE_INDEX',
        index,
      }),
  }
}
