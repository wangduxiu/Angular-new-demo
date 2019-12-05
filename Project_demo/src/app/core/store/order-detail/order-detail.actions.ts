import { Action } from '@ngrx/store';
import { ContractRestrictions } from '../contract-details/contract-details.interface';
import { Definition } from '../definitions/definition.interface';
import { Definitions } from '../definitions/definitions.interface';
import { SimplifiedEmailActor } from '../email-actors/email-actors.interface';
import { AvailablePickingDates, CalculatedTruckLoad, DeliveryMethod, Material, OrderDetailTO } from '../florder-detail/florder-detail.interface';
import { Place } from '../florders/place.interface';
import { RecurrenceDates } from './order-detail.interface';

export const ORDERDETAIL_CLEAR = 'orderDetail:ORDERDETAIL_CLEAR';
export const ORDERDETAIL_OPEN = 'orderDetail:ORDERDETAIL_OPEN';
export const ORDERDETAIL_OPEN_SUCCESS = 'orderDetail:ORDERDETAIL_OPEN_SUCCESS';
export const ORDERDETAIL_OPEN_FAIL = 'orderDetail:ORDERDETAIL_OPEN_FAIL';
export const ORDERDETAIL_CREATE_START = 'orderDetail:ORDERDETAIL_CREATE_START'; // Start create-window
export const ORDERDETAIL_CREATE_SET_DELIVERY_METHOD = 'orderDetail:CREATE_STEP_1_SET_DELIVERY_METHOD'; // Store deliveryMethod data in store, and go to details window in edit mode
export const ORDERDETAIL_CREATE_EDIT_ORDER_DETAIL = 'orderDetail:ORDERDETAIL_CREATE_EDIT_ORDER_DETAIL'; // Start adding a new material (used when editing details again)
export const ORDERDETAIL_CREATE_EDIT_ORDER_PLANNING = 'orderDetail:ORDERDETAIL_CREATE_EDIT_ORDER_PLANNING';
export const ORDERDETAIL_CREATE_EDIT_ORDER_PLANNING_GET_DATES_SUCCESS = 'orderDetail:ORDERDETAIL_CREATE_EDIT_ORDER_PLANNING_GET_DATES_SUCCESS';
export const ORDERDETAIL_CREATE_START_EDIT_MATERIAL = 'orderDetail:ORDERDETAIL_CREATE_START_EDIT_MATERIAL'; // Start editing an existing material
export const ORDERDETAIL_CREATE_SAVE_PLANNING = 'orderDetail:ORDERDETAIL_CREATE_SAVE_PLANNING';
export const ORDERDETAIL_CREATE_SAVE_MATERIAL_START = 'orderDetail:ORDERDETAIL_CREATE_SAVE_MATERIAL_START'; // Save material in store
export const ORDERDETAIL_CREATE_SAVE_MATERIAL_SUCCESS = 'orderDetail:ORDERDETAIL_CREATE_SAVE_MATERIAL_SUCCESS'; // Save material in store
export const ORDERDETAIL_CREATE_SAVE_MATERIAL_FAIL = 'orderDetail:ORDERDETAIL_CREATE_SAVE_MATERIAL_FAIL'; // Save material in store
export const ORDERDETAIL_CREATE_SAVE_MATERIAL_OVERLOAD = 'orderDetail:ORDERDETAIL_CREATE_SAVE_MATERIAL_OVERLOAD';
export const ORDERDETAIL_CREATE_DELETE_MATERIAL = 'orderDetail:ORDERDETAIL_CREATE_DELETE_MATERIAL'; // Delete material from store
export const ORDERDETAIL_CREATE_SAVE_ORDER_DETAIL = 'orderDetail:ORDERDETAIL_CREATE_SAVE_ORDER_DETAIL'; // Save order detail data in store
export const ORDERDETAIL_CREATE_SAVE_ORDER_DETAIL_GET_DATES_SUCCESS = 'orderDetail:ORDERDETAIL_CREATE_SAVE_ORDER_DETAIL_GET_DATES_SUCCESS'; // Save order detail data in store
export const ORDERDETAIL_CREATE_SUBMIT = 'orderDetail:ORDERDETAIL_CREATE_SUBMIT'; // Submit 'create order' data to middleware
export const ORDERDETAIL_CREATE_SUBMIT_FAIL = 'orderDetail:ORDERDETAIL_CREATE_SUBMIT_FAIL'; // Submit failed
export const ORDERDETAIL_CREATE_SUBMIT_SUCCESS = 'orderDetail:ORDERDETAIL_CREATE_SUBMIT_SUCCESS'; // Submit successful
export const ORDERDETAIL_CREATE_LOADINGDATES_SUCCESS = 'orderDetail:ORDERDETAIL_CREATE_LOADINGDATES_SUCCESS'; // get loading dates successful
export const ORDERDETAIL_LOAD_TRUCK_CALCULATE = 'orderDetail:ORDERDETAIL_LOAD_TRUCK_CALCULATE';
export const ORDERDETAIL_LOAD_TRUCK_CALCULATE_SUCCESS = 'orderDetail:ORDERDETAIL_LOAD_TRUCK_CALCULATE_SUCCESS';
export const ORDERDETAIL_LOAD_TRUCK_CALCULATE_FAIL = 'orderDetail:ORDERDETAIL_LOAD_TRUCK_CALCULATE_FAIL';
export const ORDERDETAIL_EDIT_DELIVERY_METHOD = 'orderDetail:ORDERDETAIL_EDIT_DELIVERY_METHOD';
export const ORDERDETAIL_COPY_ORDER = 'orderDetail:ORDERDETAIL_COPY_ORDER'; // copy order
export const ORDERDETAIL_COPY_OPEN_ORDER_SUCCESS = 'orderDetail:ORDERDETAIL_COPY_OPEN_ORDER_SUCCESS'; // copy order open order success
export const ORDERDETAIL_COPY_OPEN_ORDER_NO_VALID_CONTRACT = 'orderDetail:ORDERDETAIL_COPY_OPEN_ORDER_NO_VALID_CONTRACT'; // copy order open order success
export const ORDERDETAIL_CREATE_FROM_TEMPLATE = 'orderDetail:ORDERDETAIL_CREATE_FROM_TEMPLATE'; // copy order
export const ORDERDETAIL_RESET_MATERIALS_AND_PLANNING = 'orderDetail:ORDERDETAIL_RESET_MATERIALS_AND_PLANNING';

export const ORDERDETAIL_REQUEST_DELIVERY_DATES = 'orderDetail:ORDERDETAIL_REQUEST_DELIVERY_DATES';
export const ORDERDETAIL_REQUEST_DELIVERY_DATES_SUCCESS = 'orderDetail:ORDERDETAIL_REQUEST_DELIVERY_DATE_SUCCESS';
export const ORDERDETAIL_REQUEST_DELIVERY_DATES_FAIL = 'orderDetail:ORDERDETAIL_REQUEST_DELIVERY_DATES_FAIL';

export const ORDERDETAIL_REQUEST_DELIVERY_DATES_NOEFFECT = 'orderDetail:ORDERDETAIL_REQUEST_DELIVERY_DATES_NOEFFECT';
export const ORDERDETAIL_REQUEST_DELIVERY_DATES_SUCCESS_NOEFFECT = 'orderDetail:ORDERDETAIL_REQUEST_DELIVERY_DATE_SUCCESS_NOEFFECT';
export const ORDERDETAIL_REQUEST_DELIVERY_DATES_FAIL_NOEFFECT = 'orderDetail:ORDERDETAIL_REQUEST_DELIVERY_DATES_FAIL_NOEFFECT';

export const ORDERDETAIL_BACK_TO_DELIVERY = 'orderDetail:ORDERDETAIL_BACK_TO_DELIVERY';
export const ORDERDETAIL_BACK_TO_DETAIL = 'orderDetail:ORDERDETAIL_BACK_TO_DETAIL';

export const ORDERDETAIL_DOCUMENT_DOWNLOAD = 'orderDetail:ORDERDETAIL_DOCUMENT_DOWNLOAD';
export const ORDERDETAIL_DOCUMENT_DOWNLOAD_FAIL = 'orderDetail:ORDERDETAIL_DOCUMENT_DOWNLOAD_FAIL';
export const ORDERDETAIL_DOCUMENT_DOWNLOAD_SUCCESS = 'orderDetail:ORDERDETAIL_DOCUMENT_DOWNLOAD_SUCCESS';

export const ORDERDETAIL_CCR_DOCUMENT_DOWNLOAD = 'orderDetail:ORDERDETAIL_CCR_DOCUMENT_DOWNLOAD';
export const ORDERDETAIL_CCR_DOCUMENT_DOWNLOAD_FAIL = 'orderDetail:ORDERDETAIL_CCR_DOCUMENT_DOWNLOAD_FAIL';
export const ORDERDETAIL_CCR_DOCUMENT_DOWNLOAD_SUCCESS = 'orderDetail:ORDERDETAIL_CCR_DOCUMENT_DOWNLOAD_SUCCESS';

export const ORDERDETAIL_GET_RECURRENCE_DATES_SUCCESS = 'orderDetail:ORDERDETAIL_GET_RECURRENCE_DATES_SUCCESS';
export const ORDERDETAIL_GET_RECURRENCE_DATES = 'orderDetail:ORDERDETAIL_GET_RECURRENCE_DATES';
export const ORDERDETAIL_GET_RECURRENCE_DATES_FAIL = 'orderDetail:ORDERDETAIL_GET_RECURRENCE_DATES_FAIL';

export const ORDERDETAIL_BACK_TO_CREATE_CONFIRM = 'orderDetail:ORDERDETAIL_BACK_TO_CREATE_CONFIRM';

export class OrderCreateGetLoadingDates implements Action {
  readonly type = ORDERDETAIL_CREATE_LOADINGDATES_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class OrderDetailClear implements Action {
  readonly type = ORDERDETAIL_CLEAR;

  constructor() {
  }
}

export class OrderDetailOpen implements Action {
  readonly type = ORDERDETAIL_OPEN;

  ui = { id: ORDERDETAIL_OPEN, busy: true };

  constructor(readonly payload: { etmOrderNumber: string; salesOrderNumber: string, customerIds: string[] }) {
  }
}

export class OrderDetailOpenSuccess implements Action {
  readonly type = ORDERDETAIL_OPEN_SUCCESS;

  ui = { id: ORDERDETAIL_OPEN, busy: false };

  constructor(readonly payload: { definitions: Definitions, orderDetail: OrderDetailTO }) {
  }
}

export class OrderDetailOpenFail implements Action {
  readonly type = ORDERDETAIL_OPEN_FAIL;

  ui = { id: ORDERDETAIL_OPEN, busy: false };

  constructor(readonly payload: any) {
  }
}

export class OrderDetailCreateStart implements Action {
  readonly type = ORDERDETAIL_CREATE_START;
  readonly module = 'order';

  constructor(readonly payload: { activeCustomer: Definition, date: string, restrictions: ContractRestrictions, preventCheckingContractDetails: boolean }) {
  }
}

export class OrderDetailCreateSetDeliveryMethod implements Action {
  readonly type = ORDERDETAIL_CREATE_SET_DELIVERY_METHOD;
  readonly module = 'order';

  constructor(readonly payload: { deliveryMethod: DeliveryMethod, loadingDate: string }) {
  }
}

export class OrderDetailCreateEditOrderDetail implements Action {
  readonly type = ORDERDETAIL_CREATE_EDIT_ORDER_DETAIL;
}

export class OrderDetailCreateEditOrderPlanning implements Action {
  readonly type = ORDERDETAIL_CREATE_EDIT_ORDER_PLANNING;
}

export class OrderDetailCreateEditOrderPlanningGetDatesSuccess implements Action {
  readonly type = ORDERDETAIL_CREATE_EDIT_ORDER_PLANNING_GET_DATES_SUCCESS;
}

export class OrderDetailCreateStartEditMaterial implements Action {
  readonly type = ORDERDETAIL_CREATE_START_EDIT_MATERIAL;

  constructor(readonly payload: Material) {
  }
}

export class OrderDetailCreateSaveMaterialStart implements Action {
  readonly type = ORDERDETAIL_CREATE_SAVE_MATERIAL_START;

  constructor(readonly payload: { material: any, preventRestCall: boolean, showPopup: boolean }) {
  }
}

export class OrderDetailCreateSaveMaterialOverload implements Action {
  readonly type = ORDERDETAIL_CREATE_SAVE_MATERIAL_OVERLOAD;

  constructor(readonly payload: { calculation: CalculatedTruckLoad; material: Material },) {
  }
}

export class OrderDetailCreateSaveMaterialSuccess implements Action {
  readonly type = ORDERDETAIL_CREATE_SAVE_MATERIAL_SUCCESS;

  constructor(readonly payload: { calculation: CalculatedTruckLoad; material: Material },) {
  }
}

export class OrderDetailCreateSaveMaterialFail implements Action {
  readonly type = ORDERDETAIL_CREATE_SAVE_MATERIAL_FAIL;

  constructor(readonly payload: { error: any; material: Material }) {
  }
}

export class OrderDetailLoadTruckCalculate implements Action {
  ui = {
    id: ORDERDETAIL_LOAD_TRUCK_CALCULATE,
    busy: true,
  };

  readonly type = ORDERDETAIL_LOAD_TRUCK_CALCULATE;
}

export class OrderDetailLoadTruckCalculateSuccess implements Action {
  readonly type = ORDERDETAIL_LOAD_TRUCK_CALCULATE_SUCCESS;

  ui = {
    id: ORDERDETAIL_LOAD_TRUCK_CALCULATE,
    busy: false,
  };

  constructor(readonly payload: CalculatedTruckLoad) {
  }
}

export class OrderDetailLoadTruckCalculateFail implements Action {
  readonly type = ORDERDETAIL_LOAD_TRUCK_CALCULATE_FAIL;

  ui = {
    id: ORDERDETAIL_LOAD_TRUCK_CALCULATE,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class OrderDetailCreateRemoveMaterial implements Action {
  readonly type = ORDERDETAIL_CREATE_DELETE_MATERIAL;

  constructor(readonly payload: any) {
  }
}

export class OrderDetailEditDeliveryMethod implements Action {
  readonly type = ORDERDETAIL_EDIT_DELIVERY_METHOD;
}

export class OrderDetailSaveOrderDetail implements Action {
  readonly type = ORDERDETAIL_CREATE_SAVE_ORDER_DETAIL;

  constructor(readonly payload: { preventGetDeliveryDatesCall?: boolean }) {
  }
}

export class OrderDetailSaveOrderDetailGetDatesSuccess implements Action {
  readonly type = ORDERDETAIL_CREATE_SAVE_ORDER_DETAIL_GET_DATES_SUCCESS;

  constructor() {
  }
}

export class OrderDetailSavePlanning implements Action {
  readonly type = ORDERDETAIL_CREATE_SAVE_PLANNING;

  constructor(readonly payload: any) {
  }
}

export class OrderDetailCreateSubmit implements Action {
  readonly type = ORDERDETAIL_CREATE_SUBMIT;

  constructor(readonly payload: { emailAddresses: SimplifiedEmailActor[], loadingDates: string[] }) {
  }
}

export class OrderDetailCreateSubmitFail implements Action {
  readonly type = ORDERDETAIL_CREATE_SUBMIT_FAIL;

  constructor(readonly payload?: any) {
  }
}

export class OrderDetailCreateSubmitSuccess implements Action {
  readonly type = ORDERDETAIL_CREATE_SUBMIT_SUCCESS;

  constructor(readonly payload?: any) {
  }
}

export class OrderDetailGoBackToDelivery implements Action {
  readonly type = ORDERDETAIL_BACK_TO_DELIVERY;

  constructor(readonly payload: string) { // payload = module (flow or order)
  }
}

export class OrderDetailGoBackToDetail implements Action {
  readonly type = ORDERDETAIL_BACK_TO_DETAIL;

  constructor(readonly payload: string) { // payload = module (flow or order)
  }
}

export class OrderDetailRequestDeliveryDates implements Action {
  readonly type = ORDERDETAIL_REQUEST_DELIVERY_DATES;

  ui = {
    id: ORDERDETAIL_REQUEST_DELIVERY_DATES,
    busy: true,
  };

  constructor(readonly payload?: Actions) {
  } // Which action to trigger when success
}

export class OrderDetailRequestDeliveryDatesSuccess implements Action {
  readonly type = ORDERDETAIL_REQUEST_DELIVERY_DATES_SUCCESS;

  ui = {
    id: ORDERDETAIL_REQUEST_DELIVERY_DATES,
    busy: false,
  };

  constructor(readonly payload: AvailablePickingDates) {
  }
}

export class OrderDetailRequestDeliveryDatesFail implements Action {
  readonly type = ORDERDETAIL_REQUEST_DELIVERY_DATES_FAIL;

  ui = {
    id: ORDERDETAIL_REQUEST_DELIVERY_DATES,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class NEOrderDetailRequestDeliveryDates implements Action {
  readonly type = ORDERDETAIL_REQUEST_DELIVERY_DATES_NOEFFECT;

  ui = {
    id: ORDERDETAIL_REQUEST_DELIVERY_DATES_NOEFFECT,
    busy: true,
  };

  constructor(readonly payload?: Actions) {
  }
}

export class NEOrderDetailRequestDeliveryDatesSuccess implements Action {
  readonly type = ORDERDETAIL_REQUEST_DELIVERY_DATES_SUCCESS_NOEFFECT;

  ui = {
    id: ORDERDETAIL_REQUEST_DELIVERY_DATES_NOEFFECT,
    busy: false,
  };

  constructor(readonly payload: AvailablePickingDates) {
  }
}

export class NEOrderDetailRequestDeliveryDatesFail implements Action {
  readonly type = ORDERDETAIL_REQUEST_DELIVERY_DATES_FAIL_NOEFFECT;

  ui = {
    id: ORDERDETAIL_REQUEST_DELIVERY_DATES_NOEFFECT,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class OrderDetailCopyOrder implements Action {
  readonly type = ORDERDETAIL_COPY_ORDER;

  constructor(readonly payload: { etmOrderNumber: string }) {
  } // id
}

export class OrderDetailCopyOpenSuccess implements Action {
  readonly type = ORDERDETAIL_COPY_OPEN_ORDER_SUCCESS;

  constructor(readonly payload: { definitions: Definitions, orderDetail: OrderDetailTO }) {
  }
}

export class OrderDetailCopyOpenNoValidContract implements Action {
  readonly type = ORDERDETAIL_COPY_OPEN_ORDER_NO_VALID_CONTRACT;
}

export class OrderDetailCreateFromTemplate implements Action {
  readonly type = ORDERDETAIL_CREATE_FROM_TEMPLATE;

  constructor(readonly payload: { template: { data: OrderDetailTO, id: number, name: string }, date?: string, activeCustomer: Place, definitions: Definitions }) {
  }
}

export class OrderDetailResetMaterialsAndPlanning implements Action {
  readonly type = ORDERDETAIL_RESET_MATERIALS_AND_PLANNING;

  constructor() {
  }
}

export class OrderDetailDocumentDownloadAction implements Action {
  readonly type = ORDERDETAIL_DOCUMENT_DOWNLOAD;

  constructor(readonly payload: { documentId: string, extension: string }) {
  }
}

export class OrderDetailDocumentDownloadSuccessAction implements Action {
  readonly type = ORDERDETAIL_DOCUMENT_DOWNLOAD_SUCCESS;

  constructor(readonly payload: { blob: Blob, filename: string }) {
  }
}

export class OrderDetailDocumentDownloadFailAction implements Action {
  readonly type = ORDERDETAIL_DOCUMENT_DOWNLOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class OrderDetailCCRDocumentAction implements Action {
  readonly type = ORDERDETAIL_CCR_DOCUMENT_DOWNLOAD;

  constructor(readonly payload: { documentId: string, extension: string }) {
  }
}

export class OrderDetailCCRDocumentSuccessAction implements Action {
  readonly type = ORDERDETAIL_CCR_DOCUMENT_DOWNLOAD_SUCCESS;

  constructor(readonly payload: { blob: Blob, filename: string }) {
  }
}

export class OrderDetailCCRDocumentFailAction implements Action {
  readonly type = ORDERDETAIL_CCR_DOCUMENT_DOWNLOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class OrderDetailGetRecurrenceDates implements Action {
  readonly type = ORDERDETAIL_GET_RECURRENCE_DATES;

  constructor(readonly payload: any) {
  }
}

export class OrderDetailGetRecurrenceDatesSuccess implements Action {
  readonly type = ORDERDETAIL_GET_RECURRENCE_DATES_SUCCESS;

  constructor(readonly payload: RecurrenceDates) {
  }
}

export class OrderDetailGetRecurrenceDatesFail implements Action {
  readonly type = ORDERDETAIL_GET_RECURRENCE_DATES_FAIL;

  constructor(readonly payload: any) {
  }
}

export class OrderDetailBackToCreateConfirm implements Action {
  readonly type = ORDERDETAIL_BACK_TO_CREATE_CONFIRM;
}

export type Actions =
  | OrderDetailCreateStart
  | OrderDetailCreateSetDeliveryMethod
  | OrderDetailEditDeliveryMethod
  | OrderDetailCreateEditOrderDetail
  | OrderDetailCreateStartEditMaterial
  | OrderDetailCreateSaveMaterialStart
  | OrderDetailCreateSaveMaterialSuccess
  | OrderDetailCreateSaveMaterialFail
  | OrderDetailLoadTruckCalculate
  | OrderDetailCreateSaveMaterialOverload
  | OrderDetailLoadTruckCalculateSuccess
  | OrderDetailLoadTruckCalculateFail
  | OrderDetailCreateRemoveMaterial
  | OrderDetailSaveOrderDetail
  | OrderDetailSaveOrderDetailGetDatesSuccess
  | OrderDetailSavePlanning
  | OrderDetailCreateSubmit
  | OrderDetailCreateSubmitFail
  | OrderDetailCreateSubmitSuccess
  | OrderDetailClear
  | OrderDetailOpen
  | OrderDetailOpenFail
  | OrderDetailOpenSuccess
  | OrderDetailRequestDeliveryDates
  | OrderDetailRequestDeliveryDatesSuccess
  | OrderDetailRequestDeliveryDatesFail
  | NEOrderDetailRequestDeliveryDates
  | NEOrderDetailRequestDeliveryDatesSuccess
  | NEOrderDetailRequestDeliveryDatesFail
  | OrderDetailCreateEditOrderPlanning
  | OrderDetailCreateEditOrderPlanningGetDatesSuccess
  | OrderCreateGetLoadingDates
  | OrderDetailGoBackToDelivery
  | OrderDetailGoBackToDetail
  | OrderDetailCopyOrder
  | OrderDetailCopyOpenSuccess
  | OrderDetailCopyOpenNoValidContract
  | OrderDetailCreateFromTemplate
  | OrderDetailDocumentDownloadAction
  | OrderDetailDocumentDownloadSuccessAction
  | OrderDetailDocumentDownloadFailAction
  | OrderDetailCCRDocumentAction
  | OrderDetailCCRDocumentSuccessAction
  | OrderDetailCCRDocumentFailAction
  | OrderDetailGetRecurrenceDates
  | OrderDetailGetRecurrenceDatesSuccess
  | OrderDetailGetRecurrenceDatesFail
  | OrderDetailBackToCreateConfirm
  | OrderDetailResetMaterialsAndPlanning;
