import { Action } from '@ngrx/store';
import { CustomerInfoTO } from 'app/core/store/customer-info/customer-info.interface';
import { AdminRoles } from 'app/core/store/user-context/user-context.interface';
import { Definitions } from '../definitions/definitions.interface';

export const CUSTOMER_INFO_LOAD = 'contract-details:CUSTOMER_INFO_LOAD';
export const CUSTOMER_INFO_LOAD_FAIL = 'contract-details:CUSTOMER_INFO_LOAD_FAIL';
export const CUSTOMER_INFO_LOAD_SUCCESS = 'contract-details:CUSTOMER_INFO_LOAD_SUCCESS';

export class CustomerInfoLoadAction implements Action {
  readonly type = CUSTOMER_INFO_LOAD;

  constructor(readonly payload: string) {
  }
}

export class CustomerInfoLoadFailAction implements Action {
  readonly type = CUSTOMER_INFO_LOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class CustomerInfoLoadSuccessAction implements Action {
  readonly type = CUSTOMER_INFO_LOAD_SUCCESS;

  constructor(readonly payload: {
    customerInfo: CustomerInfoTO,
    isAdmin: boolean,
    isAgent: boolean,
    isEpsUser: boolean,
    canRelocate: boolean,
    adminRoles: AdminRoles,
    definitions: Definitions,
  }) {
  }
}

export type Actions =
    CustomerInfoLoadAction
  | CustomerInfoLoadFailAction
  | CustomerInfoLoadSuccessAction
  ;
