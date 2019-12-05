import { Action } from '@ngrx/store';
import { Material, OrderDetailTO } from '../florder-detail/florder-detail.interface';
import { Definitions } from '../definitions/definitions.interface';

export const CCRDETAIL_CREATE_START = 'ccrDetail:CCRDETAIL_CREATE_START'; // Start create-window
export const CCRDETAIL_OPEN = 'ccrDetail:CCRDETAIL_OPEN';
export const CCRDETAIL_OPEN_SUCCESS = 'ccrDetail:CCRDETAIL_OPEN_SUCCESS';
export const CCRDETAIL_OPEN_FAIL = 'ccrDetail:CCRDETAIL_OPEN_FAIL';
export const CCRDETAIL_CREATE_SAVE_MATERIAL = 'ccrDetail:CCRDETAIL_CREATE_SAVE_MATERIAL';
export const CCRDETAIL_CREATE_SUBMIT = 'ccrDetail:CCRDETAIL_CREATE_SUBMIT'; // Submit 'create ccr' data to middleware
export const CCRDETAIL_CREATE_SUBMIT_FAIL = 'ccrDetail:CCRDETAIL_CREATE_SUBMIT_FAIL'; // Submit failed
export const CCRDETAIL_CREATE_SUBMIT_SUCCESS = 'ccrDetail:CCRDETAIL_CREATE_SUBMIT_SUCCESS'; // Submit successful
export const CCRDETAIL_CREATE_START_EDIT_MATERIAL = 'ccrDetail:CCRDETAIL_CREATE_START_EDIT_MATERIAL';
export const CCRDETAIL_CREATE_DELETE_MATERIAL = 'ccrDetail:CCRDETAIL_CREATE_DELETE_MATERIAL';

export class CCRDetailCreateStart implements Action {
  readonly type = CCRDETAIL_CREATE_START;
  readonly module = 'ccr';

  constructor(readonly payload: { etmOrderNumber: string; salesOrderNumber: string }) {
  }
}

export class CCRDetailOpen implements Action {
  readonly type = CCRDETAIL_OPEN;

  constructor(readonly payload: { etmOrderNumber: string; salesOrderNumber: string }) {
  }
}

export class CCRDetailOpenSuccess implements Action {
  readonly type = CCRDETAIL_OPEN_SUCCESS;

  constructor(readonly payload: {orderDetail: OrderDetailTO, definitions: Definitions}) {
  }
}

export class CCRDetailOpenFail implements Action {
  readonly type = CCRDETAIL_OPEN_FAIL;

  constructor(readonly payload: any) {
  }
}

export class CCRDetailCreateSaveMaterial implements Action {
  readonly type = CCRDETAIL_CREATE_SAVE_MATERIAL;

  constructor(readonly payload: any) {
  }
}

export class CCRDetailCreateSubmit implements Action {
  readonly type = CCRDETAIL_CREATE_SUBMIT;

  constructor(readonly payload: any) {
  }
}

export class CCRDetailCreateSubmitFail implements Action {
  readonly type = CCRDETAIL_CREATE_SUBMIT_FAIL;

  constructor(readonly payload?: any) {
  }
}

export class CCRDetailCreateSubmitSuccess implements Action {
  readonly type = CCRDETAIL_CREATE_SUBMIT_SUCCESS;

  constructor(readonly payload?: any) {
  }
}

export class CCRDetailCreateStartEditMaterial implements Action {
  readonly type = CCRDETAIL_CREATE_START_EDIT_MATERIAL;

  constructor(readonly payload: Material) {
  }
}

export class CCRDetailCreateRemoveMaterial implements Action {
  readonly type = CCRDETAIL_CREATE_DELETE_MATERIAL;

  constructor(readonly payload: Material) {
  }
}

export type Actions =
  | CCRDetailCreateStart
  | CCRDetailOpen
  | CCRDetailOpenSuccess
  | CCRDetailOpenFail
  | CCRDetailCreateSaveMaterial
  | CCRDetailCreateSubmit
  | CCRDetailCreateSubmitFail
  | CCRDetailCreateSubmitSuccess
  | CCRDetailCreateStartEditMaterial
  | CCRDetailCreateRemoveMaterial;
