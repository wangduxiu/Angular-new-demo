import {Action} from '@ngrx/store';
import {MaterialTypes} from 'app/core/store/contract-details/contract-details.interface';
import {Definitions} from 'app/core/store/definitions/definitions.interface';
import {RecurrenceDates} from 'app/core/store/order-detail/order-detail.interface';
import {LoadingDatesTO} from 'app/core/store/relocation-detail/relocation-detail.interface';
import {CalculatedTruckLoad, DeliveryMethod, FlorderDetail, Material, OrderDetailTO} from '../florder-detail/florder-detail.interface';

export const RELOCATIONDETAIL_CLEAR = 'relocationDetail:RELOCATIONDETAIL_CLEAR';
export const RELOCATIONDETAIL_OPEN = 'relocationDetail:RELOCATIONDETAIL_OPEN';
export const RELOCATIONDETAIL_OPEN_SUCCESS = 'relocationDetail:RELOCATIONDETAIL_OPEN_SUCCESS';
export const RELOCATIONDETAIL_OPEN_FAIL = 'relocationDetail:RELOCATIONDETAIL_OPEN_FAIL';

export const RELOCATIONDETAIL_CREATE_START = 'relocationDetail:RELOCATIONDETAIL_CREATE_START'; // Start create-window
export const RELOCATIONDETAIL_CREATE_SET_DELIVERY_METHOD = 'relocationDetail:CREATE_STEP_1_SET_DELIVERY_METHOD'; // Store deliveryMethod data in store, and go to details window in edit mode
export const RELOCATIONDETAIL_EDIT_DELIVERY_METHOD = 'relocationDetail:RELOCATIONDETAIL_EDIT_DELIVERY_METHOD';
export const RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_START = 'relocationDetail:RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_START'; // Save material in store
export const RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_SUCCESS = 'relocationDetail:RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_SUCCESS'; // Save material in store
export const RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_FAIL = 'relocationDetail:RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_FAIL'; // Save material in store
export const RELOCATIONDETAIL_CREATE_START_EDIT_MATERIAL = 'relocationDetail:RELOCATIONDETAIL_CREATE_START_EDIT_MATERIAL'; // Start editing an existing material
export const RELOCATIONDETAIL_CREATE_DELETE_MATERIAL = 'relocationDetail:RELOCATIONDETAIL_CREATE_DELETE_MATERIAL'; // Delete material from store

export const RELOCATIONDETAIL_CREATE_SAVE_ORDER_DETAIL = 'relocationDetail:RELOCATIONDETAIL_CREATE_SAVE_ORDER_DETAIL'; // Save relocation detail data in store
export const RELOCATIONDETAIL_CREATE_EDIT_ORDER_DETAIL = 'relocationDetail:RELOCATIONDETAIL_CREATE_EDIT_ORDER_DETAIL'; // Start adding a new material (used when editing details again)
export const RELOCATIONDETAIL_CREATE_SAVE_PLANNING = 'relocationDetail:RELOCATIONDETAIL_CREATE_SAVE_PLANNING';
export const RELOCATIONDETAIL_CREATE_EDIT_ORDER_PLANNING = 'relocationDetail:RELOCATIONDETAIL_CREATE_EDIT_ORDER_PLANNING';

export const RELOCATIONDETAIL_CREATE_SUBMIT = 'relocationDetail:RELOCATIONDETAIL_CREATE_SUBMIT'; // Submit 'create relocation' data to middleware
export const RELOCATIONDETAIL_CREATE_SUBMIT_FAIL = 'relocationDetail:RELOCATIONDETAIL_CREATE_SUBMIT_FAIL'; // Submit failed
export const RELOCATIONDETAIL_CREATE_SUBMIT_SUCCESS = 'relocationDetail:RELOCATIONDETAIL_CREATE_SUBMIT_SUCCESS'; // Submit successful

export const RELOCATIONDETAIL_COPY_RELOCATION = 'relocationDetail:RELOCATIONDETAIL_COPY_RELOCATION';
export const RELOCATIONDETAIL_COPY_OPEN_RELOCATION_SUCCESS = 'relocationDetail:RELOCATIONDETAIL_COPY_OPEN_RELOCATION_SUCCESS';

export const RELOCATIONDETAIL_GET_RECURRENCE_DATES = 'relocationDetail:RELOCATIONDETAIL_GET_RECURRENCE_DATES';
export const RELOCATIONDETAIL_GET_RECURRENCE_DATES_SUCCESS = 'relocationDetail:RELOCATIONDETAIL_GET_RECURRENCE_DATES_SUCCESS';
export const RELOCATIONDETAIL_GET_RECURRENCE_DATES_FAIL = 'relocationDetail:RELOCATIONDETAIL_GET_RECURRENCE_DATES_FAIL';
export const RELOCATIONDETAIL_BACK_TO_CREATE_CONFIRM = 'relocationDetail:RELOCATIONDETAIL_BACK_TO_CREATE_CONFIRM';

export const RELOCATIONDETAIL_CREATE_FROM_TEMPLATE = 'relocationDetail:RELOCATIONDETAIL_CREATE_FROM_TEMPLATE';

export const RELOCATIONDETAIL_REQUEST_LOADING_DATES = 'relocationDetail:RELOCATIONDETAIL_REQUEST_LOADING_DATES';
export const RELOCATIONDETAIL_REQUEST_LOADING_DATES_SUCCESS = 'relocationDetail:RELOCATIONDETAIL_REQUEST_LOADING_DATES_SUCCESS';
export const RELOCATIONDETAIL_REQUEST_LOADING_DATES_FAIL = 'relocationDetail:RELOCATIONDETAIL_REQUEST_LOADING_DATES_FAIL';

export const RELOCATIONDETAIL_GET_MATERIALS = 'relocationDetail:RELOCATIONDETAIL_GET_MATERIALS';
export const RELOCATIONDETAIL_GET_MATERIALS_SUCCESS = 'relocationDetail:RELOCATIONDETAIL_GET_MATERIALS_SUCCESS';
export const RELOCATIONDETAIL_GET_MATERIALS_FAIL = 'relocationDetail:RELOCATIONDETAIL_GET_MATERIALS_FAIL';

export class RelocationDetailClear implements Action {
  readonly type = RELOCATIONDETAIL_CLEAR;
}

export class RelocationDetailOpen implements Action {
  readonly type = RELOCATIONDETAIL_OPEN;

  ui = {
    id: RELOCATIONDETAIL_OPEN,
    busy: true,
  };

  constructor(readonly payload: { etmOrderNumber: string; salesOrderNumber: string }) {
  }
}

export class RelocationDetailOpenSuccess implements Action {
  readonly type = RELOCATIONDETAIL_OPEN_SUCCESS;

  ui = {
    id: RELOCATIONDETAIL_OPEN,
    busy: false,
  };

  constructor(readonly payload: OrderDetailTO) {
  }
}

export class RelocationDetailOpenFail implements Action {
  readonly type = RELOCATIONDETAIL_OPEN_FAIL;

  ui = {
    id: RELOCATIONDETAIL_OPEN,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class RelocationDetailCreateStart implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_START;

  constructor(readonly payload: { date: string }) {
  }
}

export class RelocationDetailCreateSetDeliveryMethod implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_SET_DELIVERY_METHOD;

  constructor(readonly payload: { deliveryMethod: DeliveryMethod }) {
  }
}

export class RelocationDetailEditDeliveryMethod implements Action {
  readonly type = RELOCATIONDETAIL_EDIT_DELIVERY_METHOD;
}

export class RelocationDetailCreateSaveMaterialStart implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_START;

  constructor(readonly payload: { material: any, gotoPlanning?: boolean, showPopup?: boolean }) {
  }
}

export class RelocationDetailCreateSaveMaterialSuccess implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_SUCCESS;

  constructor(readonly payload: { calculation: CalculatedTruckLoad; material: Material }) {
  }
}

export class RelocationDetailCreateSaveMaterialFail implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_FAIL;

  constructor(readonly payload: any) {
  }
}

export class RelocationDetailCreateStartEditMaterial implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_START_EDIT_MATERIAL;

  constructor(readonly payload: Material) {
  }
}

export class RelocationDetailCreateRemoveMaterial implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_DELETE_MATERIAL;

  constructor(readonly payload: any) {
  }
}

export class RelocationDetailSaveOrderDetail implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_SAVE_ORDER_DETAIL;
}

export class RelocationDetailCreateEditOrderDetail implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_EDIT_ORDER_DETAIL;
}

export class RelocationDetailSavePlanning implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_SAVE_PLANNING;

  constructor(readonly payload: any) {
  }
}

export class RelocationDetailCreateEditOrderPlanning implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_EDIT_ORDER_PLANNING;
}

export class RelocationDetailCreateSubmit implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_SUBMIT;

  constructor(readonly payload: { unloadingDates: string[] }) {
  }
}

export class RelocationDetailCreateSubmitFail implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_SUBMIT_FAIL;

  constructor(readonly payload?: any) {
  }
}

export class RelocationDetailCreateSubmitSuccess implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_SUBMIT_SUCCESS;

  constructor(readonly payload?: any) {
  }
}

export class RelocationDetailCopyOrder implements Action {
  readonly type = RELOCATIONDETAIL_COPY_RELOCATION;

  constructor(readonly payload: { etmOrderNumber: string }) {
  } // id
}

export class RelocationDetailCopyOpenSuccess implements Action {
  readonly type = RELOCATIONDETAIL_COPY_OPEN_RELOCATION_SUCCESS;

  constructor(readonly payload: { definitions: Definitions, relocationDetail: any }) {
  }
}

export class RelocationDetailGetRecurrenceDates implements Action {
  readonly type = RELOCATIONDETAIL_GET_RECURRENCE_DATES;

  ui = { id: RELOCATIONDETAIL_GET_RECURRENCE_DATES, busy: true };

  constructor(readonly payload: FlorderDetail) {
  }
}

export class RelocationDetailGetRecurrenceDatesSuccess implements Action {
  readonly type = RELOCATIONDETAIL_GET_RECURRENCE_DATES_SUCCESS;

  ui = { id: RELOCATIONDETAIL_GET_RECURRENCE_DATES, busy: false };

  constructor(readonly payload: RecurrenceDates) {
  }
}

export class RelocationDetailGetRecurrenceDatesFail implements Action {
  readonly type = RELOCATIONDETAIL_GET_RECURRENCE_DATES_FAIL;

  ui = { id: RELOCATIONDETAIL_GET_RECURRENCE_DATES, busy: false };

  constructor(readonly payload: any) {
  }
}

export class RelocationDetailBackToCreateConfirm implements Action {
  readonly type = RELOCATIONDETAIL_BACK_TO_CREATE_CONFIRM;
}

export class RelocationDetailCreateFromTemplate implements Action {
  readonly type = RELOCATIONDETAIL_CREATE_FROM_TEMPLATE;

  constructor(readonly payload: { template: { data: OrderDetailTO, id: number, name: string }, date?: string }) {
  }
}

export class RelocationDetailRequestLoadingDates implements Action {
  readonly type = RELOCATIONDETAIL_REQUEST_LOADING_DATES;

  ui = {
    id: RELOCATIONDETAIL_REQUEST_LOADING_DATES,
    busy: true,
  };

  constructor(readonly payload: { fromId: string, toId: string }) {
  } // Which action to trigger when success
}

export class RelocationDetailRequestLoadingDatesSuccess implements Action {
  readonly type = RELOCATIONDETAIL_REQUEST_LOADING_DATES_SUCCESS;

  ui = {
    id: RELOCATIONDETAIL_REQUEST_LOADING_DATES,
    busy: false,
  };

  constructor(readonly payload: LoadingDatesTO) {
  }
}

export class RelocationDetailRequestLoadingDatesFail implements Action {
  readonly type = RELOCATIONDETAIL_REQUEST_LOADING_DATES_FAIL;

  ui = {
    id: RELOCATIONDETAIL_REQUEST_LOADING_DATES,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class RelocationDetailGetMaterials implements Action {
  readonly type = RELOCATIONDETAIL_GET_MATERIALS;

  ui = {
    id: RELOCATIONDETAIL_GET_MATERIALS,
    busy: true,
  };

  constructor(readonly payload: { depotId: string }) {
  } // Which action to trigger when success
}

export class RelocationDetailGetMaterialsSuccess implements Action {
  readonly type = RELOCATIONDETAIL_GET_MATERIALS_SUCCESS;

  ui = {
    id: RELOCATIONDETAIL_GET_MATERIALS,
    busy: false,
  };

  constructor(readonly payload: MaterialTypes) {
  }
}

export class RelocationDetailGetMaterialsFail implements Action {
  readonly type = RELOCATIONDETAIL_GET_MATERIALS_FAIL;

  ui = {
    id: RELOCATIONDETAIL_GET_MATERIALS,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export type Actions =
  RelocationDetailClear
  | RelocationDetailOpen
  | RelocationDetailOpenFail
  | RelocationDetailOpenSuccess
  | RelocationDetailCreateStart
  | RelocationDetailCreateSetDeliveryMethod
  | RelocationDetailEditDeliveryMethod
  | RelocationDetailCreateSaveMaterialStart
  | RelocationDetailCreateSaveMaterialSuccess
  | RelocationDetailCreateSaveMaterialFail
  | RelocationDetailCreateStartEditMaterial
  | RelocationDetailCreateRemoveMaterial
  | RelocationDetailSaveOrderDetail
  | RelocationDetailCreateEditOrderDetail
  | RelocationDetailSavePlanning
  | RelocationDetailCreateEditOrderPlanning

  | RelocationDetailCreateSubmit
  | RelocationDetailCreateSubmitFail
  | RelocationDetailCreateSubmitSuccess

  | RelocationDetailCopyOrder
  | RelocationDetailCopyOpenSuccess

  | RelocationDetailGetRecurrenceDates
  | RelocationDetailGetRecurrenceDatesSuccess
  | RelocationDetailGetRecurrenceDatesFail
  | RelocationDetailBackToCreateConfirm

  | RelocationDetailCreateFromTemplate

  | RelocationDetailRequestLoadingDates
  | RelocationDetailRequestLoadingDatesSuccess
  | RelocationDetailRequestLoadingDatesFail

  | RelocationDetailGetMaterials
  | RelocationDetailGetMaterialsSuccess
  | RelocationDetailGetMaterialsFail
  ;
