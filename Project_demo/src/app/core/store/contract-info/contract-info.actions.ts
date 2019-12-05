import {Action} from '@ngrx/store';
import {ContractInfoLevel, ContractInfoTO} from 'app/core/store/contract-info/contract-info.interface';
import {Place} from 'app/core/store/florders/place.interface';
import {Definitions} from '../definitions/definitions.interface';

export const CONTRACT_INFO = 'contract-info:CONTRACT_INFO';
export const CONTRACT_INFO_LOAD = 'contract-info:CONTRACT_INFO_LOAD';
export const CONTRACT_INFO_LOAD_FAIL = 'contract-info:CONTRACT_INFO_LOAD_FAIL';
export const CONTRACT_INFO_LOAD_SUCCESS = 'contract-info:CONTRACT_INFO_LOAD_SUCCESS';

export class ContractInfoLoadAction implements Action {
  readonly type = CONTRACT_INFO_LOAD;

  ui = {
    id: CONTRACT_INFO,
    busy: true,
  };

  constructor(readonly payload: { from: ContractInfoLevel, to: ContractInfoLevel, ids: string[] }) {
  }
}

export class ContractInfoLoadSuccessAction implements Action {
  readonly type = CONTRACT_INFO_LOAD_SUCCESS;

  ui = {
    id: CONTRACT_INFO,
    busy: false,
  };

  constructor(readonly payload: { contractInfo: ContractInfoTO; definitions: Definitions, locations: Place[], type: 'FLOWH' | 'FLOWR' | 'ORDER' }) {
  }
}

export class ContractInfoLoadFailAction implements Action {
  readonly type = CONTRACT_INFO_LOAD_FAIL;

  ui = {
    id: CONTRACT_INFO,
    busy: false,
  };

  constructor(readonly payload: { error: string }) {
  }
}

export type Actions =
  ContractInfoLoadAction
  | ContractInfoLoadSuccessAction
  | ContractInfoLoadFailAction
  ;
