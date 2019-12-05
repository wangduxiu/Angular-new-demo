/**
 * Initiële state voor settings
 */
import {UI} from 'app/core/store/ui/ui.interface';

export const UI_INITIAL_STATE: UI = {
  busy: false,
  lock: false,
  busyProcesses: [],
  lockProcesses: [],
};

export function reducer(state: UI = UI_INITIAL_STATE, action: any): UI {
  if (action.ui) {
    const newState = {
      ...state,
      busyProcesses: [...state.busyProcesses],
      lockProcesses: [...state.lockProcesses],
    };
    if (action.ui.busy) {
      if (newState.busyProcesses.indexOf(action.ui.id) < 0) {
        newState.busyProcesses.push(action.ui.id);
      }
    } else if (newState.busyProcesses.indexOf(action.ui.id) >= 0) {
      newState.busyProcesses.splice(newState.busyProcesses.indexOf(action.ui.id), 1);
    }
    newState.busy = newState.busyProcesses.length > 0;

    if (action.ui.lock) {
      if (newState.lockProcesses.indexOf(action.ui.id) < 0) {
        newState.lockProcesses.push(action.ui.id);
      }
    } else if (newState.lockProcesses.indexOf(action.ui.id) >= 0) {
      newState.lockProcesses.splice(newState.lockProcesses.indexOf(action.ui.id), 1);
    }
    newState.lock = newState.lockProcesses.length > 0;
    return newState;
  }
  return state;
}
