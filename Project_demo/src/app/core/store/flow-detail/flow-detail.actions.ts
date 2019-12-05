import { Action } from '@ngrx/store';
import { ContractInfo } from 'app/core/store/contract-info/contract-info.interface';
import { CustomerInfo } from 'app/core/store/customer-info/customer-info.interface';
import { FlowDetailTO, Material } from '../florder-detail/florder-detail.interface';
import { Florder } from '../florders/florder.interface';
import { DatesRange } from './flow-detail.interface';

export const FLOWDETAIL_OPEN = 'flowDetail:FLOWDETAIL_OPEN';
export const FLOWDETAIL_OPEN_SUCCESS = 'flowDetail:FLOWDETAIL_OPEN_SUCCESS';
export const FLOWDETAIL_OPEN_FAIL = 'flowDetail:FLOWDETAIL_OPEN_FAIL';
export const FLOWDETAIL_CREATE_START = 'flowDetail:FLOWDETAIL_CREATE_START'; // Start create-window
export const FLOWDETAIL_CREATE_SET_DELIVERY_METHOD = 'flowDetail:FLOW_CREATE_STEP_1_SET_DELIVERY_METHOD'; // Store deliveryMethod data in store, and go to details window in edit mode
export const FLOWDETAIL_CREATE_EDIT_FLOW_DETAIL = 'flowDetail:FLOWDETAIL_CREATE_EDIT_FLOW_DETAIL'; // Start adding a new material (used when editing details again)
export const FLOWDETAIL_CREATE_EDIT_FLOW_PLANNING = 'flowDetail:FLOWDETAIL_CREATE_EDIT_FLOW_PLANNING';
export const FLOWDETAIL_CREATE_START_EDIT_MATERIAL = 'flowDetail:FLOWDETAIL_CREATE_START_EDIT_MATERIAL'; // Start editing an existing material
export const FLOWDETAIL_CREATE_SAVE_MATERIAL = 'flowDetail:FLOWDETAIL_CREATE_SAVE_MATERIAL'; // Save material in store
export const FLOWDETAIL_CREATE_DELETE_MATERIAL = 'flowDetail:FLOWDETAIL_CREATE_DELETE_MATERIAL'; // Delete material from store
export const FLOWDETAIL_CREATE_SAVE_FLOW_DETAIL = 'flowDetail:FLOWDETAIL_CREATE_SAVE_FLOW_DETAIL'; // Save flow detail data in store
export const FLOWDETAIL_CREATE_SAVE_FLOW_DETAIL_GET_DATES_SUCCESS = 'flowDetail:FLOWDETAIL_CREATE_SAVE_FLOW_DETAIL_GET_DATES_SUCCESS'; // Save flow detail data in store
export const FLOWDETAIL_CREATE_SAVE_PLANNING = 'flowDetail:FLOWDETAIL_CREATE_SAVE_PLANNING';
export const FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT = 'flowDetail:FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT'; // Submit 'create flow' data to middleware
export const FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT_FAIL = 'flowDetail:FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT_FAIL'; // Submit failed
export const FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT_SUCCESS = 'flowDetail:FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT_SUCCESS'; // Submit successful
export const FLOWDETAIL_EDIT_DELIVERY_METHOD = 'flowDetail:FLOWDETAIL_EDIT_DELIVERY_METHOD';
export const FLOWDETAIL_COPY_FLOW = 'flowDetail:FLOWDETAIL_COPY_FLOW'; // copy flow
export const FLOWDETAIL_COPY_OPEN_FLOW_SUCCESS = 'flowDetail:FLOWDETAIL_COPY_OPEN_FLOW_SUCCESS'; // copy flow open flow success
export const FLOWDETAIL_COPY_OPEN_FLOW_FAIL = 'flowDetail:FLOWDETAIL_COPY_OPEN_FLOW_FAIL'; // copy flow open flow success
export const FLOWDETAIL_COPY_OPEN_FLOW_NO_VALID_CONTRACT = 'flowDetail:FLOWDETAIL_COPY_OPEN_FLOW_NO_VALID_CONTRACT'; // copy flow open flow success but no valid contract
export const FLOWDETAIL_RESET_MATERIALS_AND_PLANNING = 'flowDetail:FLOWDETAIL_RESET_MATERIALS_AND_PLANNING';

export const FLOWDETAIL_ACCEPT_FLOW_START = 'flowDetail:FLOWDETAIL_ACCEPT_FLOW_START'; // copy flow open flow success but no valid contract
export const FLOWDETAIL_ACCEPT_FLOW_SUCCESS = 'flowDetail:FLOWDETAIL_ACCEPT_FLOW_SUCCESS'; // copy flow open flow success but no valid contract
export const FLOWDETAIL_ACCEPT_FLOW_FAIL = 'flowDetail:FLOWDETAIL_ACCEPT_FLOW_FAIL'; // copy flow open flow success but no valid contract

export const FLOWDETAIL_REQUEST_DELIVERY_DATES = 'flowDetail:FLOWDETAIL_REQUEST_DELIVERY_DATES';
export const FLOWDETAIL_REQUEST_DELIVERY_DATES_SUCCESS = 'flowDetail:FLOWDETAIL_REQUEST_DELIVERY_DATE_SUCCESS';
export const FLOWDETAIL_REQUEST_DELIVERY_DATES_FAIL = 'flowDetail:FLOWDETAIL_REQUEST_DELIVERY_DATES_FAIL';

export const FLOWDETAIL_BACK_TO_DELIVERY = 'flowDetail:FLOWDETAIL_BACK_TO_DELIVERY';
export const FLOWDETAIL_BACK_TO_DETAIL = 'flowDetail:FLOWDETAIL_BACK_TO_DETAIL';

export const FLOWDETAIL_EDIT_FLOW = 'flowDetail:FLOWDETAIL_EDIT_FLOW'; // edit flow
export const FLOWDETAIL_EDIT_ACCEPT_FLOW = 'flowDetail:FLOWDETAIL_EDIT_ACCEPT_FLOW'; // edit accept flow

export const FLOWDETAIL_DOCUMENT_DOWNLOAD = 'flowDetail:FLOWDETAIL_DOCUMENT_DOWNLOAD';
export const FLOWDETAIL_DOCUMENT_DOWNLOAD_FAIL = 'flowDetail:FLOWDETAIL_DOCUMENT_DOWNLOAD_FAIL';
export const FLOWDETAIL_DOCUMENT_DOWNLOAD_SUCCESS = 'flowDetail:FLOWDETAIL_DOCUMENT_DOWNLOAD_SUCCESS';

export const FLOWDETAIL_CHECK_FLOW_DATE = 'flowDetail:FLOWDETAIL_CHECK_FLOW_DATE';
export const FLOWDETAIL_CHECK_FLOW_DATE_SUCCESS = 'flowDetail:FLOWDETAIL_CHECK_FLOW_DATE_SUCCESS';
export const FLOWDETAIL_CHECK_FLOW_DATE_ERROR = 'flowDetail:FLOWDETAIL_CHECK_FLOW_DATE_ERROR';

export class FlowDetailOpen implements Action {
  readonly type = FLOWDETAIL_OPEN;

  ui = {
    id: FLOWDETAIL_OPEN,
    busy: true,
  };

  constructor(readonly payload: { etmOrderNumber: string; salesOrderNumber: string },) {
  }
}

export class FlowDetailOpenSuccess implements Action {
  readonly type = FLOWDETAIL_OPEN_SUCCESS;

  ui = {
    id: FLOWDETAIL_OPEN,
    busy: false,
  };

  constructor(readonly payload: { flowDetail: FlowDetailTO, customerInfo: CustomerInfo, contractInfo: ContractInfo }) {
  }
}

export class FlowDetailOpenFail implements Action {
  readonly type = FLOWDETAIL_OPEN_FAIL;

  ui = {
    id: FLOWDETAIL_OPEN,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class FlowDetailCreateStart implements Action {
  readonly type = FLOWDETAIL_CREATE_START;
  readonly module = 'flow';
}

export class FlowDetailCreateSetDeliveryMethod implements Action {
  readonly type = FLOWDETAIL_CREATE_SET_DELIVERY_METHOD;
  readonly module = 'flow';

  constructor(readonly payload: any) {
  }
}

export class FlowDetailCreateEditFlowDetail implements Action {
  readonly type = FLOWDETAIL_CREATE_EDIT_FLOW_DETAIL;

  constructor() {
  }
}

export class FlowDetailCreateEditFlowPlanning implements Action {
  readonly type = FLOWDETAIL_CREATE_EDIT_FLOW_PLANNING;
}

export class FlowDetailCreateStartEditMaterial implements Action {
  readonly type = FLOWDETAIL_CREATE_START_EDIT_MATERIAL;

  constructor(readonly payload: Material) {
  }
}

export class FlowDetailCreateSaveMaterial implements Action {
  readonly type = FLOWDETAIL_CREATE_SAVE_MATERIAL;

  constructor(readonly payload: any) {
  }
}

export class FlowDetailCreateRemoveMaterial implements Action {
  readonly type = FLOWDETAIL_CREATE_DELETE_MATERIAL;

  constructor(readonly payload: any) {
  }
}

export class FlowDetailEditDeliveryMethod implements Action {
  readonly type = FLOWDETAIL_EDIT_DELIVERY_METHOD;

  constructor() {
  }
}

export class FlowDetailSaveFlowDetail implements Action {
  readonly type = FLOWDETAIL_CREATE_SAVE_FLOW_DETAIL;

  constructor() {
  }
}

export class FlowDetailSaveFlowDetailGetDatesSuccess implements Action {
  readonly type = FLOWDETAIL_CREATE_SAVE_FLOW_DETAIL_GET_DATES_SUCCESS;

  constructor() {
  }
}

export class FlowDetailSavePlanning implements Action {
  readonly type = FLOWDETAIL_CREATE_SAVE_PLANNING;

  constructor(readonly payload: any) {
  }
}

export class FlowDetailCreateOrUpdateSubmit implements Action {
  readonly type = FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT;

  constructor(readonly payload: { flowDetailForm: any },) {
  }
}

export class FlowDetailCreateOrUpdateSubmitFail implements Action {
  readonly type = FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT_FAIL;

  constructor(readonly payload?: any) {
  }
}

export class FlowDetailCreateOrUpdateSubmitSuccess implements Action {
  readonly type = FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT_SUCCESS;

  constructor(readonly payload?: any) {
  }
}

export class FlowDetailGoBackToDelivery implements Action {
  readonly type = FLOWDETAIL_BACK_TO_DELIVERY;

  constructor(readonly payload: string) { // payload = module (flow)
  }
}

export class FlowDetailGoBackToDetail implements Action {
  readonly type = FLOWDETAIL_BACK_TO_DETAIL;

  constructor(readonly payload: string) { // payload = module (flow)
  }
}

export class FlowDetailRequestDeliveryDates implements Action {
  readonly type = FLOWDETAIL_REQUEST_DELIVERY_DATES;

  ui = {
    id: FLOWDETAIL_REQUEST_DELIVERY_DATES,
    busy: true,
  };

  constructor(readonly payload?: Actions) {} // Which action to trigger when success
}

export class FlowDetailRequestDeliveryDatesSuccess implements Action {
  readonly type = FLOWDETAIL_REQUEST_DELIVERY_DATES_SUCCESS;

  ui = {
    id: FLOWDETAIL_REQUEST_DELIVERY_DATES,
    busy: false,
  };

  constructor(readonly payload: DatesRange) {}
}

export class FlowDetailRequestDeliveryDatesFail implements Action {
  readonly type = FLOWDETAIL_REQUEST_DELIVERY_DATES_FAIL;

  ui = {
    id: FLOWDETAIL_REQUEST_DELIVERY_DATES,
    busy: false,
  };

  constructor(readonly payload: any) {}
}

export class FlowDetailCopyFlow implements Action {
  readonly type = FLOWDETAIL_COPY_FLOW;

  ui = {
    id: FLOWDETAIL_COPY_FLOW,
    busy: true,
  };

  constructor(readonly payload: { etmOrderNumber: string }) {
  } // id
}

export class FlowDetailCopyOpenSuccess implements Action {
  readonly type = FLOWDETAIL_COPY_OPEN_FLOW_SUCCESS;

  ui = {
    id: FLOWDETAIL_COPY_FLOW,
    busy: false,
  };

  constructor(readonly payload: { flowDetail: FlowDetailTO, customerInfo: CustomerInfo, contractInfo: ContractInfo }) {
  }
}

export class FlowDetailCopyOpenFail implements Action {
  readonly type = FLOWDETAIL_COPY_OPEN_FLOW_FAIL;

  ui = {
    id: FLOWDETAIL_COPY_FLOW,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class FlowDetailCopyOpenNoValidContract implements Action {
  readonly type = FLOWDETAIL_COPY_OPEN_FLOW_NO_VALID_CONTRACT;

  ui = {
    id: FLOWDETAIL_COPY_FLOW,
    busy: false,
  };
}

export class FlowAcceptFlowStartAction implements Action {
  readonly type = FLOWDETAIL_ACCEPT_FLOW_START;

  ui = {
    id: FLOWDETAIL_ACCEPT_FLOW_START,
    busy: true,
  };

}
export class FlowAcceptFlowSuccessAction implements Action {
  readonly type = FLOWDETAIL_ACCEPT_FLOW_SUCCESS;

  ui = {
    id: FLOWDETAIL_ACCEPT_FLOW_START,
    busy: false,
  };

  // TODO refactor using /flows/refresh
  constructor(readonly payload: { flow: Florder }) {
  }
}

export class FlowAcceptFlowFailAction implements Action {
  readonly type = FLOWDETAIL_ACCEPT_FLOW_FAIL;

  ui = {
    id: FLOWDETAIL_ACCEPT_FLOW_START,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}


export class FlowDetailEditFlow implements Action {
  readonly type = FLOWDETAIL_EDIT_FLOW;

  constructor(readonly payload: { flowDetail: FlowDetailTO, customerInfo: CustomerInfo, contractInfo: ContractInfo }) {
  }
}

export class FlowDetailEditAcceptFlow implements Action {
  readonly type = FLOWDETAIL_EDIT_ACCEPT_FLOW;

  constructor(readonly payload: { flowDetail: FlowDetailTO, customerInfo: CustomerInfo, contractInfo: ContractInfo}) {
  }
}

export class FlowDetailDocumentDownloadAction implements Action {
  readonly type = FLOWDETAIL_DOCUMENT_DOWNLOAD;

  constructor(readonly payload: { etmOrderNumber: string, extension: string }) {
  }
}

export class FlowDetailDocumentDownloadSuccessAction implements Action {
  readonly type = FLOWDETAIL_DOCUMENT_DOWNLOAD_SUCCESS;

  constructor(readonly payload: { blob: Blob, filename: string }) {
  }
}

export class FlowDetailDocumentDownloadFailAction implements Action {
  readonly type = FLOWDETAIL_DOCUMENT_DOWNLOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class FlowDetailCheckFlowDateAction implements Action {
  readonly type = FLOWDETAIL_CHECK_FLOW_DATE;

  ui = {
    id: FLOWDETAIL_CHECK_FLOW_DATE,
    busy: true,
  };

  constructor(readonly payload: any) {}
}

export class FlowDetailCheckFlowDateSuccessAction implements Action {
  readonly type = FLOWDETAIL_CHECK_FLOW_DATE_SUCCESS;

  ui = {
    id: FLOWDETAIL_CHECK_FLOW_DATE,
    busy: false,
  };

  constructor(readonly payload: any) {}
}

export class FlowDetailCheckFlowDateErrorAction implements Action {
  readonly type = FLOWDETAIL_CHECK_FLOW_DATE_ERROR;

  ui = {
    id: FLOWDETAIL_CHECK_FLOW_DATE,
    busy: false,
  };

  constructor(readonly payload: any) {}
}

export class FlowDetailResetMaterialsAndPlanning implements Action {
  readonly type = FLOWDETAIL_RESET_MATERIALS_AND_PLANNING;

  constructor() {}
}

export type Actions =
  | FlowDetailCreateStart
  | FlowDetailCreateSetDeliveryMethod
  | FlowDetailEditDeliveryMethod
  | FlowDetailCreateEditFlowDetail
  | FlowDetailCreateStartEditMaterial
  | FlowDetailCreateSaveMaterial
  | FlowDetailCreateRemoveMaterial
  | FlowDetailSaveFlowDetail
  | FlowDetailSaveFlowDetailGetDatesSuccess
  | FlowDetailSavePlanning
  | FlowDetailCreateOrUpdateSubmit
  | FlowDetailCreateOrUpdateSubmitFail
  | FlowDetailCreateOrUpdateSubmitSuccess
  | FlowDetailOpen
  | FlowDetailOpenFail
  | FlowDetailOpenSuccess
  | FlowDetailCreateEditFlowPlanning
  | FlowDetailGoBackToDelivery
  | FlowDetailGoBackToDetail
  | FlowDetailRequestDeliveryDates
  | FlowDetailRequestDeliveryDatesSuccess
  | FlowDetailRequestDeliveryDatesFail
  | FlowDetailCopyFlow
  | FlowDetailCopyOpenSuccess
  | FlowDetailCopyOpenFail
  | FlowDetailCopyOpenNoValidContract
  | FlowDetailEditFlow
  | FlowDetailEditAcceptFlow
  | FlowDetailDocumentDownloadAction
  | FlowDetailDocumentDownloadSuccessAction
  | FlowDetailDocumentDownloadFailAction
  | FlowAcceptFlowStartAction
  | FlowAcceptFlowSuccessAction
  | FlowAcceptFlowFailAction
  | FlowDetailCheckFlowDateAction
  | FlowDetailCheckFlowDateSuccessAction
  | FlowDetailCheckFlowDateErrorAction
  | FlowDetailResetMaterialsAndPlanning;
