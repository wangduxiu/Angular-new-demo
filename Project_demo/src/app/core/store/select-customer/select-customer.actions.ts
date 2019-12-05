import { Action } from '@ngrx/store';

export const SET_ACTIVE_CUSTOMER = 'select-customer:SET_ACTIVE_CUSTOMER';
export const CLEAR_ACTIVE_CUSTOMER = 'select-customer:CLEAR_ACTIVE_CUSTOMER';

export class SetActiveCustomerAction implements Action {
  readonly type = SET_ACTIVE_CUSTOMER;
  constructor(readonly payload: {id: string, name: string}) {}
}

export class ClearActiveCustomerAction implements Action {
  readonly type = CLEAR_ACTIVE_CUSTOMER;
  constructor() {}
}

export type Actions
  = SetActiveCustomerAction
  | ClearActiveCustomerAction;
