import {
  createMachine,
  interpret,
  EventObject,
  Typestate,
  StateMachine,
} from '@xstate/fsm'

export { createMachine } from '@xstate/fsm'

import { ref } from 'vue'

type ContextRecord = Record<string, any>

export function useMachine<
  MContext extends ContextRecord,
  MEvents extends EventObject,
  MState extends Typestate<MContext>
>(
  machineConfig: StateMachine.Config<MContext, MEvents>,
  options: Record<string, any>
) {
  const machine = createMachine(machineConfig, options)
  const service = interpret(machine).start()
  const state = ref<StateMachine.State<MContext, MEvents, MState>>(
    machine.initialState
  )
  service.subscribe(_state => (state.value = _state))

  return {
    service,
    state,
    stop: () => service.stop(),
  }
}
