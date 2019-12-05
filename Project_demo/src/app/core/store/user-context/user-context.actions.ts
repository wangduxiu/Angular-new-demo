import { Action } from '@ngrx/store';
import { CustomersTO, UserContextTO } from './user-context.interface';

export const USERCONTEXT_LOAD         = 'usercontext:USERCONTEXT_LOAD';
export const USERCONTEXT_LOAD_FAIL    = 'usercontext:USERCONTEXT_LOAD_FAIL';
export const USERCONTEXT_LOAD_SUCCESS = 'usercontext:USERCONTEXT_LOAD_SUCCESS';
export const USERCONTEXT_UPDATE_TUTORIAL = 'usercontext:USERCONTEXT_UPDATE_TUTORIAL';
export const CUSTOMERS_CLEAR           = 'usercontext:CUSTOMERS_CLEAR';
export const CUSTOMERS_LOAD           = 'usercontext:CUSTOMERS_LOAD';
export const CUSTOMERS_LOAD_FAIL      = 'usercontext:CUSTOMERS_LOAD_FAIL';
export const CUSTOMERS_LOAD_SUCCESS   = 'usercontext:CUSTOMERS_LOAD_SUCCESS';

export class UserContextLoadAction implements Action {
  readonly type = USERCONTEXT_LOAD;
}

export class UserContextLoadSuccessAction implements Action {
  readonly type = USERCONTEXT_LOAD_SUCCESS;

  constructor(readonly payload: UserContextTO) {}
}

export class UserContextLoadFailAction implements Action {
  readonly type = USERCONTEXT_LOAD_FAIL;

  constructor(readonly payload: any) {}
}

export class UserContextUpdateTutorialAction implements Action {
  readonly type = USERCONTEXT_UPDATE_TUTORIAL;
}

export class CustomersClearAction implements Action {
  readonly type = CUSTOMERS_CLEAR;
}

export class CustomersLoadAction implements Action {
  readonly type = CUSTOMERS_LOAD;

  constructor(readonly payload: string) {} // salesOrganisationId
}

export class CustomersLoadSuccessAction implements Action {
  readonly type = CUSTOMERS_LOAD_SUCCESS;

  constructor(readonly payload: CustomersTO) {}
}

export class CustomersLoadFailAction implements Action {
  readonly type = CUSTOMERS_LOAD_FAIL;

  constructor(readonly payload: any) {}
}

export type Actions
  = UserContextLoadAction
  | UserContextLoadSuccessAction
  | UserContextLoadFailAction
  | CustomersClearAction
  | CustomersLoadAction
  | CustomersLoadSuccessAction
  | UserContextUpdateTutorialAction
  | CustomersLoadFailAction;

