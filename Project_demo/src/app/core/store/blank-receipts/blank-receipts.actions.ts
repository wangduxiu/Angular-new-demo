import { Action } from '@ngrx/store';
import { BlankReceiptItem } from './blank-receipts.interface';

export const BLANK_RECEIPT_CREATE = 'blankReceipt:BLANK_RECEIPT_CREATE';
export const BLANK_RECEIPT_CREATE_FAIL = 'blankReceipt:BLANK_RECEIPT_CREATE_FAIL';
export const BLANK_RECEIPT_CREATE_SUCCESS = 'blankReceipt:BLANK_RECEIPT_CREATE_SUCCESS';

export class BlankReceiptCreateAction implements Action {
  readonly type = BLANK_RECEIPT_CREATE;

  constructor(readonly payload: { blankReceipt: BlankReceiptItem }) {
  }
}

export class BlankReceiptCreateSuccessAction implements Action {
  readonly type = BLANK_RECEIPT_CREATE_SUCCESS;

  constructor(readonly payload: { blob: Blob, filename: string }) {
  }
}

export class BlankReceiptCreateFailAction implements Action {
  readonly type = BLANK_RECEIPT_CREATE_FAIL;

  constructor(readonly payload: any) {
  }
}

export type Actions =
  | BlankReceiptCreateAction
  | BlankReceiptCreateSuccessAction
  | BlankReceiptCreateFailAction
  ;
