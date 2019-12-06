import { environment } from '../../../environments/environment';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 */
import { ActionReducerMap, compose } from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import { Settings } from '@app/core/interfaces/settings.interface';
// do not delete this line * ngdel * import interfaces

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromSettings from './settings/settings.reducer';
// do not delete this line * ngdel * import reducers

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  settings: Settings;
  router?: RouterReducerState;
  // do not delete this line * ngdel * add interfaces
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const stateMap = {
  settings: fromSettings.reducer,
  router: routerReducer
  // do not delete this line * ngdel * add reducers
};

export const reducers: ActionReducerMap<State> = environment.production
  ? stateMap
  : stateMap;

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 */

/**
 * Settings store functions
 */
export const getSettingsState = (state: State) => state.settings;
export const getSelectedLanguage = compose(
  fromSettings.getSelectedLanguage,
  getSettingsState
);
export const getSelectedCulture = compose(
  fromSettings.getSelectedCulture,
  getSettingsState
);
export const getAvailableLanguages = compose(
  fromSettings.getAvailableLanguages,
  getSettingsState
);
export const getIsOnline = compose(
  fromSettings.getIsOnline,
  getSettingsState
);
