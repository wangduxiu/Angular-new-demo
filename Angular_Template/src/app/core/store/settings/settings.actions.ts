import { Action } from '@ngrx/store';

/**
 * Actions
 */
export const SET_LANGUAGE = '[SETTINGS] set language';
export const SET_CULTURE = '[SETTINGS] set culture';
export const SET_ONLINE = '[SETTINGS] set online';

/**
 * Action types
 */
export class SetLanguage implements Action {
  readonly type = SET_LANGUAGE;

  constructor(public payload: string) {}
}

export class SetCulture implements Action {
  readonly type = SET_CULTURE;

  constructor(public payload: string) {}
}

export class SetOnline implements Action {
  readonly type = SET_ONLINE;

  constructor(public payload: boolean) {}
}

/**
 * Exporteert een type alias voor alle acties in de groep.
 * Dit zodat reducers eenvoudig action types kunnen samenstellen.
 */
export type Actions = SetLanguage | SetCulture | SetOnline;
