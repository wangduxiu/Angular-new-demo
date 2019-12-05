import { Action } from '@ngrx/store';
import { StockFilter } from './stock-filter.interface';
import { Definitions } from '../definitions/definitions.interface';
import { Place } from '../florders/place.interface';
import { PowerBIConfig } from './stock.interface';

export const STOCK_LOAD = 'stock:STOCK_LOAD';
export const STOCK_LOAD_FAIL = 'stock:STOCK_LOAD_FAIL';
export const STOCK_LOAD_SUCCESS = 'stock:STOCK_LOAD_SUCCESS';

export const POWER_BI_URL_LOAD = 'stock:POWER_BI_URL_LOAD';
export const POWER_BI_URL_LOAD_SUCCESS = 'stock:POWER_BI_URL_LOAD_SUCCESS';
export const POWER_BI_URL_LOAD_FAIL = 'stock:POWER_BI_URL_LOAD_FAIL';

export class StockLoadAction implements Action {
  readonly type = STOCK_LOAD;

  constructor(readonly payload: { filter: StockFilter }) {
  }
}

export class StockLoadSuccessAction implements Action {
  readonly type = STOCK_LOAD_SUCCESS;

  constructor(readonly payload: { definitions: Definitions; places: { [key: string]: Place }; totalItems: number; items: any; filter: StockFilter }) {
  }
}

export class StockLoadFailAction implements Action {
  readonly type = STOCK_LOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class PowerBIUrlLoadAction implements Action {
  readonly type = POWER_BI_URL_LOAD;

  constructor() {
  }
}

export class PowerBIUrlLoadSuccessAction implements Action {
  readonly type = POWER_BI_URL_LOAD_SUCCESS;

  constructor(readonly payload: PowerBIConfig) {
  }
}

export class PowerBIUrlLoadFailAction implements Action {
  readonly type = POWER_BI_URL_LOAD_FAIL;

  constructor(readonly payload: Error) {
  }
}

export type Actions =
  | StockLoadAction
  | StockLoadSuccessAction
  | StockLoadFailAction
  | PowerBIUrlLoadAction
  | PowerBIUrlLoadSuccessAction
  | PowerBIUrlLoadFailAction
  ;
