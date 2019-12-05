import { Action } from '@ngrx/store';
import { CustomerInfoTO } from 'app/core/store/customer-info/customer-info.interface';
import { AdminRoles } from 'app/core/store/user-context/user-context.interface';
import { Definitions } from '../definitions/definitions.interface';

export const CUSTOMER_INFO = 'customer-info:CUSTOMER_INFO';
export const CUSTOMER_INFO_RESET = 'customer-info:CUSTOMER_INFO_RESET';
export const CUSTOMER_INFO_LOAD = 'customer-info:CUSTOMER_INFO_LOAD';
export const CUSTOMER_INFO_LOAD_FAIL = 'customer-info:CUSTOMER_INFO_LOAD_FAIL';
export const CUSTOMER_INFO_LOAD_SUCCESS = 'customer-info:CUSTOMER_INFO_LOAD_SUCCESS';

export class CustomerInfoLoadAction implements Action {
  readonly type = CUSTOMER_INFO_LOAD;

  ui = {
    id: CUSTOMER_INFO,
    busy: true,
  };

  constructor(readonly payload: string) {
  }
}

export class CustomerInfoResetAction implements Action {
  readonly type = CUSTOMER_INFO_RESET;
}

export class CustomerInfoLoadFailAction implements Action {
  readonly type = CUSTOMER_INFO_LOAD_FAIL;

  ui = {
    id: CUSTOMER_INFO,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class CustomerInfoLoadSuccessAction implements Action {
  readonly type = CUSTOMER_INFO_LOAD_SUCCESS;

  ui = {
    id: CUSTOMER_INFO,
    busy: false,
  };

  constructor(readonly payload: {
    customerInfo: CustomerInfoTO,
    isAdmin: boolean,
    isAgent: boolean,
    isEpsUser: boolean,
    canRelocate: boolean,
    useEmailActors: boolean,
    isTransporter: boolean,
    adminRoles: AdminRoles,
    definitions: Definitions,
  }) {
  }
}

export type Actions =
  CustomerInfoResetAction
  | CustomerInfoLoadAction
  | CustomerInfoLoadFailAction
  | CustomerInfoLoadSuccessAction
  ;
