import {Action} from '@ngrx/store';
import {DefinitionsTO} from './definitions.interface';

export const DEFINITIONS_LOAD         = 'definitions:LOAD';
export const DEFINITIONS_LOAD_FAIL    = 'definitions:LOAD_FAIL';
export const DEFINITIONS_LOAD_SUCCESS = 'definitions:LOAD_SUCCESS';

export class DefinitionsLoadAction implements Action {
  readonly type = DEFINITIONS_LOAD;

  ui = {
    id: DEFINITIONS_LOAD,
    busy: true,
  };

  constructor(readonly payload: { language }) {}
}

export class DefinitionsLoadSuccessAction implements Action {
  readonly type = DEFINITIONS_LOAD_SUCCESS;

  ui = {
    id: DEFINITIONS_LOAD,
    busy: false,
  };

  constructor(readonly payload: DefinitionsTO) {}
}

export class DefinitionsLoadFailAction implements Action {
  readonly type = DEFINITIONS_LOAD_FAIL;

  ui = {
    id: DEFINITIONS_LOAD,
    busy: false,
  };

  constructor(readonly payload: any) {}
}

export type Actions
  = DefinitionsLoadAction
  | DefinitionsLoadSuccessAction
  | DefinitionsLoadFailAction;
