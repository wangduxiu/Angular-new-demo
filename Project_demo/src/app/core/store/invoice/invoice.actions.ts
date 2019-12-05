import { Action } from '@ngrx/store';
import { Invoice, InvoiceFilter, InvoicesFromMW } from '../../model/Invoice.interface';
import { ErrorMessage } from '../../util/error.interface';

export const CLEAR_INVOICES_FILTER = 'invoice:CLEAR_INVOICES_FILTER';
export const QUERY_INVOICES_START = 'invoice:QUERY_INVOICES_START';
export const QUERY_INVOICES_SUCCESS = 'invoice:QUERY_INVOICES_SUCCESS';
export const QUERY_INVOICES_FAIL = 'invoice:QUERY_INVOICES_FAIL';

export const INVOICE_DOWNLOAD = 'invoice:INVOICE_DOWNLOAD';
export const INVOICE_DOWNLOAD_SUCCESS = 'invoice:INVOICE_DOWNLOAD_SUCCESS';
export const INVOICE_DOWNLOAD_FAIL = 'invoice:INVOICE_DOWNLOAD_FAIL';

export const INVOICE_DOWNLOAD_LIST = 'invoice:INVOICE_DOWNLOAD_LIST';
export const INVOICE_DOWNLOAD_LIST_SUCCESS = 'invoice:INVOICE_DOWNLOAD_LIST_SUCCESS';
export const INVOICE_DOWNLOAD_LIST_FAIL = 'invoice:INVOICE_DOWNLOAD_LIST_FAIL';

export const DESCARTES_INVOICES_URL_LOAD = 'invoice:DESCARTES_INVOICES_URL_LOAD';
export const DESCARTES_INVOICES_URL_LOAD_SUCCESS = 'invoice:DESCARTES_INVOICES_URL_LOAD_SUCCESS';
export const DESCARTES_INVOICES_URL_LOAD_FAIL = 'invoice:DESCARTES_INVOICES_URL_LOAD_FAIL';

export class ClearInvoicesFilterAction implements Action {
  readonly type = CLEAR_INVOICES_FILTER;
}

export class QueryInvoicesStartAction implements Action {
  readonly type = QUERY_INVOICES_START;

  constructor(readonly payload: { filter: InvoiceFilter }) {
  }
}

export class QueryInvoicesSuccessAction implements Action {
  readonly type = QUERY_INVOICES_SUCCESS;

  constructor(readonly payload: { filter: InvoiceFilter, invoices: InvoicesFromMW }) {
  }
}

export class QueryInvoicesFailAction implements Action {
  readonly type = QUERY_INVOICES_FAIL;

  constructor(readonly payload: { errorMessage: ErrorMessage }) {
  }
}

export class InvoiceDownloadAction implements Action {
  readonly type = INVOICE_DOWNLOAD;

  constructor(readonly payload: { invoice: Invoice }) {
  }
}

export class InvoiceDownloadSuccessAction implements Action {
  readonly type = INVOICE_DOWNLOAD_SUCCESS;

  constructor(readonly payload: {blob: Blob, filename: string}) {
  }
}

export class InvoiceDownloadFailAction implements Action {
  readonly type = INVOICE_DOWNLOAD_FAIL;

  constructor(readonly payload: Error) {
  }
}

export class InvoiceDownloadListAction implements Action {
  readonly type = INVOICE_DOWNLOAD_LIST;
}

export class InvoiceDownloadListSuccessAction implements Action {
  readonly type = INVOICE_DOWNLOAD_LIST_SUCCESS;

  constructor(readonly payload: {blob: Blob, filename: string}) {
  }
}

export class InvoiceDownloadListFailAction implements Action {
  readonly type = INVOICE_DOWNLOAD_LIST_FAIL;

  constructor(readonly payload: Error) {
  }
}

export class DescartesInvoicesUrlLoadAction implements Action {
  readonly type = DESCARTES_INVOICES_URL_LOAD;

  constructor() {
  }
}

export class DescartesInvoicesUrlLoadSuccessAction implements Action {
  readonly type = DESCARTES_INVOICES_URL_LOAD_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class DescartesInvoicesUrlLoadFailAction implements Action {
  readonly type = DESCARTES_INVOICES_URL_LOAD_FAIL;

  constructor(readonly payload: Error) {
  }
}

export type Actions
  = QueryInvoicesStartAction
  | QueryInvoicesSuccessAction
  | QueryInvoicesFailAction
  | ClearInvoicesFilterAction
  | InvoiceDownloadAction
  | InvoiceDownloadSuccessAction
  | InvoiceDownloadFailAction
  | InvoiceDownloadListAction
  | InvoiceDownloadListSuccessAction
  | InvoiceDownloadListFailAction
  | DescartesInvoicesUrlLoadAction
  | DescartesInvoicesUrlLoadSuccessAction
  | DescartesInvoicesUrlLoadFailAction;
