import {Action} from '@ngrx/store';
import {AdminDefinitionsTO} from './admin-definitions.model';

export const ADMIN_DEFINITIONS_LOAD         = 'admin-definitions:LOAD';
export const ADMIN_DEFINITIONS_LOAD_FAIL    = 'admin-definitions:LOAD_FAIL';
export const ADMIN_DEFINITIONS_LOAD_SUCCESS = 'admin-definitions:LOAD_SUCCESS';

export class AdminDefinitionsLoadAction implements Action {
  readonly type = ADMIN_DEFINITIONS_LOAD;

  ui = {
    id: ADMIN_DEFINITIONS_LOAD,
    busy: true,
  };

  constructor(readonly payload: { language }) {}
}

export class AdminDefinitionsLoadSuccessAction implements Action {
  readonly type = ADMIN_DEFINITIONS_LOAD_SUCCESS;

  ui = {
    id: ADMIN_DEFINITIONS_LOAD,
    busy: false,
  };

  constructor(readonly payload: { adminDefinitions: AdminDefinitionsTO, roles: { [key: string]: string } }) {}
}

export class AdminDefinitionsLoadFailAction implements Action {
  readonly type = ADMIN_DEFINITIONS_LOAD_FAIL;

  ui = {
    id: ADMIN_DEFINITIONS_LOAD,
    busy: false,
  };

  constructor(readonly payload: any) {}
}

export type Actions
  = AdminDefinitionsLoadAction
  | AdminDefinitionsLoadSuccessAction
  | AdminDefinitionsLoadFailAction;
