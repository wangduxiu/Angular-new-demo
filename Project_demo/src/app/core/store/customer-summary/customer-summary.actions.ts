import { Action } from '@ngrx/store';
import { CustomerSummaryMW } from '../customer-summary/customer-summary.interface';

export const CUSTOMER_SUMMARY = 'customer summary:CUSTOMER_SUMMARY';
export const CUSTOMER_SUMMARY_LOAD = 'customer summary:CUSTOMER_SUMMARY_LOAD';
export const CUSTOMER_SUMMARY_FAIL = 'customer summary:CUSTOMER_SUMMARY_FAIL';
export const CUSTOMER_SUMMARY_LOAD_SUCCES = 'customer summary:CUSTOMER_SUMMARY_LOAD_SUCCES';
export const CUSTOMER_SUMMARY_SET_OUTDATED = 'customer summary:CUSTOMER_SUMMARY_SET_OUTDATED';

export const CUSTOMER_STOCK = 'customer summary:CUSTOMER_STOCK';
export const CUSTOMER_STOCK_LOAD = 'customer summary:CUSTOMER_STOCK_LOAD';
export const CUSTOMER_STOCK_LOAD_FAIL = 'customer summary:CUSTOMER_STOCK_LOAD_FAIL';
export const CUSTOMER_STOCK_LOAD_SUCCESS = 'customer summary:CUSTOMER_STOCK_LOAD_SUCCESS';

export class CustomerSummaryLoadAction implements Action {
  readonly type = CUSTOMER_SUMMARY_LOAD;

  ui = {
    id: CUSTOMER_SUMMARY,
    busy: true,
  };

  constructor(readonly payload: string) {
  }
}

export class CustomerSummarySuccessAction implements Action {
  readonly type = CUSTOMER_SUMMARY_LOAD_SUCCES;

  ui = {
    id: CUSTOMER_SUMMARY,
    busy: false,
  };


  constructor(readonly payload: { customerSummary: CustomerSummaryMW }) {
  }
}

export class CustomerSummaryFailAction implements Action {
  readonly type = CUSTOMER_SUMMARY_FAIL;

  ui = {
    id: CUSTOMER_SUMMARY,
    busy: false,
  };


  constructor(readonly payload: any) {
  }
}

export class CustomerSummarySetOutdatedAction implements Action {
  readonly type = CUSTOMER_SUMMARY_SET_OUTDATED;
}

export class CustomerStockLoadAction implements Action {
  readonly type = CUSTOMER_STOCK_LOAD;
}

export class CustomerStockLoadFailAction implements Action {
  readonly type = CUSTOMER_STOCK_LOAD_FAIL;

  constructor(readonly payload: any) { }
}

export class CustomerStockLoadSuccessAction implements Action {
  readonly type = CUSTOMER_STOCK_LOAD_SUCCESS;

  constructor(readonly payload: any) { }
}


export type Actions =
  | CustomerSummaryLoadAction
  | CustomerSummarySuccessAction
  | CustomerSummaryFailAction
  | CustomerSummarySetOutdatedAction
  | CustomerStockLoadAction
  | CustomerStockLoadFailAction
  | CustomerStockLoadSuccessAction
  ;
