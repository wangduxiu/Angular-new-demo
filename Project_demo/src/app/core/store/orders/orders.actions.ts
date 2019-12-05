import { Action } from '@ngrx/store';
import { FilterValuesTO } from 'app/core/store/florders/filtervalues.interface';
import { Definitions } from '../definitions/definitions.interface';
import { FlordersFilter } from '../florders/florders-filter.interface';
import { FlordersTO } from '../florders/florders.interface';
import { Place } from '../florders/place.interface';

export const ORDERS_SET_FILTER = 'orders:ORDERS_SET_FILTER';
export const ORDERS_CLEAR = 'orders:ORDERS_CLEAR';
export const ORDERS_LOAD = 'orders:ORDERS_LOAD';
export const ORDERS_LOAD_FAIL = 'orders:ORDERS_LOAD_FAIL';
export const ORDERS_LOAD_SUCCESS = 'orders:ORDERS_LOAD_SUCCESS';
export const ORDERS_DOWNLOAD = 'orders:ORDERS_DOWNLOAD';
export const ORDERS_DOWNLOAD_SUCCESS = 'orders:ORDERS_DOWNLOAD_SUCCESS';
export const ORDERS_DOWNLOAD_FAIL = 'orders:ORDERS_DOWNLOAD_FAIL';
export const ORDER_ACCEPT_DEVIATION = 'orders:ORDER_ACCEPT_DEVIATION';
export const ORDER_ACCEPT_DEVIATION_SUCCESS = 'orders:ORDER_ACCEPT_DEVIATION_SUCCESS';
export const ORDER_ACCEPT_DEVIATION_FAIL = 'orders:ORDER_ACCEPT_DEVIATION_FAIL';
export const ORDER_REJECT_DEVIATION = 'orders:ORDER_REJECT_DEVIATION';
export const ORDER_REJECT_DEVIATION_SUCCESS = 'orders:ORDER_REJECT_DEVIATION_SUCCESS';
export const ORDER_REJECT_DEVIATION_FAIL = 'orders:ORDER_REJECT_DEVIATION_FAIL';

export const DASHBOARD_TILE_LATEST_ORDERS_LOAD = 'orders:DASHBOARD_TILE_LATEST_ORDERS_LOAD';
export const DASHBOARD_TILE_LATEST_ORDERS_LOAD_FAIL = 'orders:DASHBOARD_TILE_LATEST_ORDERS_LOAD_FAIL';
export const DASHBOARD_TILE_LATEST_ORDERS_LOAD_SUCCESS = 'orders:DASHBOARD_TILE_LATEST_ORDERS_LOAD_SUCCESS';

export const ORDERS_FILTER_VALUES_RESET = 'orders:ORDERS_FILTER_VALUES_RESET';
export const ORDERS_FILTER_VALUES = 'orders:ORDERS_FILTER_VALUES';
export const ORDERS_FILTER_VALUES_LOAD = 'orders:ORDERS_FILTER_VALUES_LOAD';
export const ORDERS_FILTER_VALUES_LOAD_FAIL = 'orders:ORDERS_FILTER_VALUES_LOAD_FAIL';
export const ORDERS_FILTER_VALUES_LOAD_SUCCESS = 'orders:ORDERS_FILTER_VALUES_LOAD_SUCCESS';

export class OrdersSetFilterAction implements Action {
  readonly type = ORDERS_SET_FILTER;

  constructor(readonly payload: {
    filter: FlordersFilter,
  }) {
  }
}

export class OrdersClearAction implements Action {
  readonly type = ORDERS_CLEAR;

  constructor() {
  }
}

export class OrdersLoadAction implements Action {
  readonly type = ORDERS_LOAD;

  ui = {
    id: ORDERS_LOAD,
    busy: true,
  };

  constructor(readonly payload?: {
    filter: FlordersFilter,
  }) {
  }
}

export class OrdersLoadSuccessAction implements Action {
  readonly type = ORDERS_LOAD_SUCCESS;
  readonly module = 'order';

  ui = {
    id: ORDERS_LOAD,
    busy: false,
  };

  constructor(readonly payload: {
    definitions: Definitions;
    places: {
      [key: string]: Place,
    };
    orders: FlordersTO
  }) {
  }
}

export class OrdersLoadFailAction implements Action {
  readonly type = ORDERS_LOAD_FAIL;

  ui = {
    id: ORDERS_LOAD,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class OrdersDownloadAction implements Action {
  readonly type = ORDERS_DOWNLOAD;

  constructor(readonly payload: {
    filter?: FlordersFilter;
    totalItems: number,
    exportType: string,
    customerIds: string[]
  }) {
  }
}

export class OrdersDownloadSuccessAction implements Action {
  readonly type = ORDERS_DOWNLOAD_SUCCESS;

  constructor(readonly payload: {
    blob: Blob,
    filename: string,
  }) {
  }
}

export class OrdersDownloadFailAction implements Action {
  readonly type = ORDERS_DOWNLOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class OrderAcceptDeviationAction implements Action {
  readonly type = ORDER_ACCEPT_DEVIATION;

  constructor(readonly payload: {
    ccrNumber: string,
  }) {
  }
}

export class OrderAcceptDeviationSuccessAction implements Action {
  readonly type = ORDER_ACCEPT_DEVIATION_SUCCESS;

  constructor(readonly payload: {
    ccrNumber: string,
  }) {
  }
}

export class OrderAcceptDeviationFailAction implements Action {
  readonly type = ORDER_ACCEPT_DEVIATION_FAIL;

  constructor(readonly payload: {
    ccrNumber: string,
    error: Error,
  }) {
  }
}

export class OrderRejectDeviationAction implements Action {
  readonly type = ORDER_REJECT_DEVIATION;

  constructor(readonly payload: {
    ccrNumber: string,
  }) {
  }
}

export class OrderRejectDeviationSuccessAction implements Action {
  readonly type = ORDER_REJECT_DEVIATION_SUCCESS;

  constructor(readonly payload: {
    ccrNumber: string,
  }) {
  }
}

export class OrderRejectDeviationFailAction implements Action {
  readonly type = ORDER_REJECT_DEVIATION_FAIL;

  constructor(readonly payload: {
    ccrNumber: string,
    error: Error,
  }) {
  }
}

export class DasboardTileLatestOrdersLoad implements Action {
  readonly type = DASHBOARD_TILE_LATEST_ORDERS_LOAD;
}

export class DasboardTileLatestOrdersLoadFail implements Action {
  readonly type = DASHBOARD_TILE_LATEST_ORDERS_LOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class DasboardTileLatestOrdersLoadSuccess implements Action {
  readonly type = DASHBOARD_TILE_LATEST_ORDERS_LOAD_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class OrdersFilterValuesLoadAction implements Action {
  readonly type = ORDERS_FILTER_VALUES_LOAD;

  ui = {
    id: ORDERS_FILTER_VALUES,
    busy: true,
  };

  constructor(readonly payload: { customerIds: string[] }) {
  }
}

export class OrdersFilterValuesResetAction implements Action {
  readonly type = ORDERS_FILTER_VALUES_RESET;
}

export class OrdersFilterValuesLoadSuccessAction implements Action {
  readonly type = ORDERS_FILTER_VALUES_LOAD_SUCCESS;
  readonly module = 'order';

  ui = {
    id: ORDERS_FILTER_VALUES,
    busy: false,
  };

  constructor(readonly payload: {
    filterValues: FilterValuesTO,
    definitions: Definitions
  }) {
  }
}

export class OrdersFilterValuesLoadFailAction implements Action {
  readonly type = ORDERS_FILTER_VALUES_LOAD_FAIL;

  ui = {
    id: ORDERS_FILTER_VALUES,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export type Actions =
  | OrdersSetFilterAction
  | OrdersClearAction
  | OrdersLoadAction
  | OrdersLoadSuccessAction
  | OrdersLoadFailAction
  | OrdersDownloadAction
  | OrdersDownloadSuccessAction
  | OrdersDownloadFailAction
  | OrderAcceptDeviationAction
  | OrderAcceptDeviationSuccessAction
  | OrderAcceptDeviationFailAction
  | OrderRejectDeviationAction
  | OrderRejectDeviationSuccessAction
  | OrderRejectDeviationFailAction
  | DasboardTileLatestOrdersLoad
  | DasboardTileLatestOrdersLoadFail
  | DasboardTileLatestOrdersLoadSuccess
  | OrdersFilterValuesResetAction
  | OrdersFilterValuesLoadAction
  | OrdersFilterValuesLoadSuccessAction
  | OrdersFilterValuesLoadFailAction
  ;
