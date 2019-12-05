import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { AbstractEffects } from '../AbstractEffects';
import { TranslateService } from '@ngx-translate/core';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';
import { util } from '../../util/util';

import * as invoiceActions from '../invoice/invoice.actions';
import * as flowDetailActions from '../flow-detail/flow-detail.actions';
import * as flowsActions from '../flows/flows.actions';
import * as orderDetailActions from '../order-detail/order-detail.actions';
import * as ordersActions from '../orders/orders.actions';
import * as blankReceiptsActions from '../blank-receipts/blank-receipts.actions';
import * as usersActions from '../admin/users/users.actions';

@Injectable()
export class OpenPdfEffect extends AbstractEffects {

  constructor(azureMonitoringService: AzureMonitoringService, private actions$: Actions, translateService: TranslateService) {
    super(translateService, azureMonitoringService);
  }

  @Effect({ dispatch: false })
  openPdf$: Observable<Action> = this.actions$
    .ofType(
      invoiceActions.INVOICE_DOWNLOAD_SUCCESS,
      invoiceActions.INVOICE_DOWNLOAD_LIST_SUCCESS,
      flowDetailActions.FLOWDETAIL_DOCUMENT_DOWNLOAD_SUCCESS,
      flowsActions.FLOWS_DOWNLOAD_SUCCESS,
      orderDetailActions.ORDERDETAIL_DOCUMENT_DOWNLOAD_SUCCESS,
      orderDetailActions.ORDERDETAIL_CCR_DOCUMENT_DOWNLOAD_SUCCESS,
      ordersActions.ORDERS_DOWNLOAD_SUCCESS,
      blankReceiptsActions.BLANK_RECEIPT_CREATE_SUCCESS,
      usersActions.CLIENT_USER_BULK_DOWNLOAD_EXAMPLE_SUCCESS,
      usersActions.CLIENT_USER_BULK_UPLOAD_RESPONSE
    )
    .switchMap(({ payload }) => {
      util.openBlob(payload.blob, payload.filename.toLocaleLowerCase());
      return Observable.of(null);
    });
}
