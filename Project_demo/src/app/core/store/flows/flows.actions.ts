import {Action} from '@ngrx/store';
import {Handshakes} from 'app/core/store/contract-info/contract-info.interface';
import {FilterValuesTO} from 'app/core/store/florders/filtervalues.interface';
import {Definition} from '../definitions/definition.interface';
import {Definitions} from '../definitions/definitions.interface';
import {Florder} from '../florders/florder.interface';
import {FlordersFilter} from '../florders/florders-filter.interface';
import {FlordersTO} from '../florders/florders.interface';
import {Place} from '../florders/place.interface';

export const FLOWS_CLEAR = 'flows:FLOWS_CLEAR';

export const FLOWS_SET_FILTER = 'flows:FLOWS_SET_FILTER';
export const FLOWS_LOAD = 'flows:FLOWS_LOAD';
export const FLOWS_LOAD_FAIL = 'flows:FLOWS_LOAD_FAIL';
export const FLOWS_LOAD_SUCCESS = 'flows:FLOWS_LOAD_SUCCESS';
export const FLOWS_ACCEPT_FLOW_START = 'flows:FLOWS_ACCEPT_FLOWS_START';
export const FLOWS_ACCEPT_FLOW_SUCCESS = 'flows:FLOWS_ACCEPT_FLOWS_SUCCESS';
export const FLOWS_ACCEPT_FLOW_FAIL = 'flows:FLOWS_ACCEPT_FLOWS_FAIL';
export const FLOWS_CANCEL_FLOW_START = 'flows:FLOWS_CANCEL_FLOWS_START';
export const FLOWS_CANCEL_FLOW_SUCCESS = 'flows:FLOWS_CANCEL_FLOWS_SUCCESS';
export const FLOWS_CANCEL_FLOW_FAIL = 'flows:FLOWS_CANCEL_FLOWS_FAIL';
export const FLOWS_ACCEPT_FLOW_FROM_BATCH_START = 'flows:FLOWS_ACCEPT_FLOW_FROM_BATCH_START';
export const FLOWS_ACCEPT_FLOW_FROM_BATCH_SUCCESS = 'flows:FLOWS_ACCEPT_FLOW_FROM_BATCH_SUCCESS';
export const FLOWS_ACCEPT_FLOW_FROM_BATCH_FAIL = 'flows:FLOWS_ACCEPT_FLOW_FROM_BATCH_FAIL';
export const FLOWS_DOWNLOAD = 'flows:FLOWS_DOWNLOAD';
export const FLOWS_DOWNLOAD_SUCCESS = 'flows:FLOWS_DOWNLOAD_SUCCESS';
export const FLOWS_DOWNLOAD_FAIL = 'flows:FLOWS_DOWNLOAD_FAIL';

export const FLOWS_SET_FILTER_OPEN_HANDSHAKES = 'flows:FLOWS_SET_FILTER_OPEN_HANDSHAKES';

export const DASHBOARD_TILE_LATEST_FLOWS_LOAD = 'flows:DASHBOARD_TILE_LATEST_FLOWS_LOAD';
export const DASHBOARD_TILE_LATEST_FLOWS_LOAD_FAIL = 'flows:DASHBOARD_TILE_LATEST_FLOWS_LOAD_FAIL';
export const DASHBOARD_TILE_LATEST_FLOWS_LOAD_SUCCESS = 'flows:DASHBOARD_TILE_LATEST_FLOWS_LOAD_SUCCESS';

export const FLOW_TYPES_LOAD = 'flows:FLOW_TYPES_LOAD';
export const FLOW_TYPES_LOAD_FAIL = 'flows:FLOW_TYPES_LOAD_FAIL';
export const FLOW_TYPES_LOAD_SUCCESS = 'flows:FLOW_TYPES_LOAD_SUCCESS';

export const FLOWS_FILTER_VALUES_RESET = 'flows:FLOWS_FILTER_VALUES_RESET';
export const FLOWS_FILTER_VALUES = 'flows:FLOWS_FILTER_VALUES';
export const FLOWS_FILTER_VALUES_LOAD = 'flows:FLOWS_FILTER_VALUES_LOAD';
export const FLOWS_FILTER_VALUES_LOAD_FAIL = 'flows:FLOWS_FILTER_VALUES_LOAD_FAIL';
export const FLOWS_FILTER_VALUES_LOAD_SUCCESS = 'flows:FLOWS_FILTER_VALUES_LOAD_SUCCESS';

export class FlowsClearAction implements Action {
  readonly type = FLOWS_CLEAR;
}

export class FlowsSetFilterAction implements Action {
  readonly type = FLOWS_SET_FILTER;

  constructor(readonly payload: { filter: FlordersFilter }) {
  }
}

export class FlowsLoadAction implements Action {
  readonly type = FLOWS_LOAD;

  ui = {
    id: FLOWS_LOAD,
    busy: true,
  };

  constructor(readonly payload?: { filter: FlordersFilter }) {
  }
}

export class FlowsLoadSuccessAction implements Action {
  readonly type = FLOWS_LOAD_SUCCESS;
  readonly module = 'flow';

  ui = {
    id: FLOWS_LOAD,
    busy: false,
  };

  constructor(readonly payload: { definitions: Definitions, places: { [key: string]: Place }, flows: FlordersTO, handshakes: Handshakes }) {
  }
}

export class FlowsLoadFailAction implements Action {
  readonly type = FLOWS_LOAD_FAIL;

  ui = {
    id: FLOWS_LOAD,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class FlowsAcceptFlowStartAction implements Action {
  readonly type = FLOWS_ACCEPT_FLOW_START;

  constructor(readonly payload: { flow: Florder }) {
  }
}

export class FlowsAcceptFlowSuccessAction implements Action {
  readonly type = FLOWS_ACCEPT_FLOW_SUCCESS;

  constructor(readonly payload:  { status: Definition, etmOrderNumber: string, salesOrderNumber: string, deliveryNumber: string, shipmentNumber: string }) {
  }
}

export class FlowsAcceptFlowFailAction implements Action {
  readonly type = FLOWS_ACCEPT_FLOW_FAIL;

  constructor(readonly payload: any) {
  }
}

export class FlowsCancelFlowStartAction implements Action {
  readonly type = FLOWS_CANCEL_FLOW_START;

  constructor(readonly payload: { flow: Florder }) {
  }
}

export class FlowsCancelFlowSuccessAction implements Action {
  readonly type = FLOWS_CANCEL_FLOW_SUCCESS;
  // {"status":"03","etmOrderNumber":"0100004081","salesOrderNumber":null,"deliveryNumber":null,"shipmentNumber":null}  TODO
  constructor(readonly payload: { status: Definition, etmOrderNumber: string, salesOrderNumber: string, deliveryNumber: string, shipmentNumber: string }) {
  }
}

export class FlowsCancelFlowFailAction implements Action {
  readonly type = FLOWS_CANCEL_FLOW_FAIL;

  constructor(readonly payload: any) {
  }
}

export class FlowsAcceptFlowFromBatchStartAction implements Action {
  readonly type = FLOWS_ACCEPT_FLOW_FROM_BATCH_START;

  constructor(readonly payload: { flow: Florder }) {
  }
}

export class FlowsAcceptFlowFromBatchSuccessAction implements Action {
  readonly type = FLOWS_ACCEPT_FLOW_FROM_BATCH_SUCCESS;

  constructor(readonly payload: { flow: Florder, status: Definition }) {
  }
}

export class FlowsAcceptFlowFromBatchFailAction implements Action {
  readonly type = FLOWS_ACCEPT_FLOW_FROM_BATCH_FAIL;

  constructor(readonly payload: any) {
  }
}


export class FlowsDownloadAction implements Action {
  readonly type = FLOWS_DOWNLOAD;

  constructor(readonly payload: { filter?: FlordersFilter; totalItems: number, exportType: string }) {
  }
}

export class FlowsDownloadSuccessAction implements Action {
  readonly type = FLOWS_DOWNLOAD_SUCCESS;

  constructor(readonly payload: { blob: Blob, filename: string }) {
  }
}

export class FlowsDownloadFailAction implements Action {
  readonly type = FLOWS_DOWNLOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class FlowsSetFilterOpenHandshakesAction implements Action {
  readonly type = FLOWS_SET_FILTER_OPEN_HANDSHAKES;
}

export class DasboardTileLatestFlowsLoad implements Action {
  readonly type = DASHBOARD_TILE_LATEST_FLOWS_LOAD;
}

export class DasboardTileLatestFlowsLoadFail implements Action {
  readonly type = DASHBOARD_TILE_LATEST_FLOWS_LOAD_FAIL;
  constructor(readonly payload: any) { }
}

export class DasboardTileLatestFlowsLoadSuccess implements Action {
  readonly type = DASHBOARD_TILE_LATEST_FLOWS_LOAD_SUCCESS;
  constructor(readonly payload: any) { }
}

export class GetFlowTypesLoadAction implements Action {
  readonly type = FLOW_TYPES_LOAD;
  constructor() { }
}

export class GetFlowTypesLoadFailAction implements Action {
  readonly type = FLOW_TYPES_LOAD_FAIL;
  constructor(readonly payload: any) { }
}

export class GetFlowTypesLoadSuccessAction implements Action {
  readonly type = FLOW_TYPES_LOAD_SUCCESS;
  constructor(readonly payload: any) { }
}

export class FlowsFilterValuesResetAction implements Action {
  readonly type = FLOWS_FILTER_VALUES_RESET;
}

export class FlowsFilterValuesLoadAction implements Action {
  readonly type = FLOWS_FILTER_VALUES_LOAD;

  ui = {
    id: FLOWS_FILTER_VALUES,
    busy: true,
  };

  constructor(readonly payload: { customerId: string }) {
  }
}

export class FlowsFilterValuesLoadSuccessAction implements Action {
  readonly type = FLOWS_FILTER_VALUES_LOAD_SUCCESS;
  readonly module = 'order';

  ui = {
    id: FLOWS_FILTER_VALUES,
    busy: false,
  };

  constructor(readonly payload: {
    filterValues: FilterValuesTO,
    definitions: Definitions
  }) {
  }
}

export class FlowsFilterValuesLoadFailAction implements Action {
  readonly type = FLOWS_FILTER_VALUES_LOAD_FAIL;

  ui = {
    id: FLOWS_FILTER_VALUES,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export type Actions =
  FlowsSetFilterAction
  | FlowsClearAction
  | FlowsLoadAction
  | FlowsLoadSuccessAction
  | FlowsLoadFailAction
  | FlowsAcceptFlowStartAction
  | FlowsAcceptFlowSuccessAction
  | FlowsAcceptFlowFailAction
  | FlowsCancelFlowStartAction
  | FlowsCancelFlowSuccessAction
  | FlowsCancelFlowFailAction
  | FlowsAcceptFlowFromBatchStartAction
  | FlowsAcceptFlowFromBatchSuccessAction
  | FlowsAcceptFlowFromBatchFailAction
  | FlowsDownloadAction
  | FlowsDownloadSuccessAction
  | FlowsDownloadFailAction
  | FlowsSetFilterOpenHandshakesAction
  | DasboardTileLatestFlowsLoad
  | DasboardTileLatestFlowsLoadFail
  | DasboardTileLatestFlowsLoadSuccess
  | GetFlowTypesLoadAction
  | GetFlowTypesLoadFailAction
  | GetFlowTypesLoadSuccessAction
  | FlowsFilterValuesResetAction
  | FlowsFilterValuesLoadAction
  | FlowsFilterValuesLoadSuccessAction
  | FlowsFilterValuesLoadFailAction
  ;
