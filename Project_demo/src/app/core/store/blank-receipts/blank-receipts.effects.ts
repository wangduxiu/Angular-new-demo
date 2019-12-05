import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import * as actions from './blank-receipts.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import { BlankReceipt } from './blank-receipts.interface';
import { BlankReceiptRestService } from '../../services/rest/blank-receipt.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import { TranslateService } from '@ngx-translate/core';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';

@Injectable()
export class BlankReceiptsEffects extends AbstractEffects {

  constructor(private store: Store<BlankReceipt>, azureMonitoringService: AzureMonitoringService, private actions$: Actions, private blankReceiptRestService: BlankReceiptRestService, translateService: TranslateService) {
    super(translateService, azureMonitoringService);
  }

  @Effect()
  createBlankReceipt$: Observable<Action> = this.actions$
    .ofType(actions.BLANK_RECEIPT_CREATE)
    .debounceTime(50)
    .switchMap(({ payload }) => // Register to this event, unregister previous if new event occurs.
      this.blankReceiptRestService.createBlankReceipt(payload.blankReceipt)   // Create blank receipt
        .map((data: any) => {
          const filenameRegexResult = (/filename=([^;]*)/g).exec(data.headers.get('content-disposition'));
          const filename = filenameRegexResult.length && filenameRegexResult[1] || 'blank_receipts.pdf';
          return new actions.BlankReceiptCreateSuccessAction({ blob: data._body, filename });
        })
        .catch((err) => this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
            Observable.of(new actions.BlankReceiptCreateFailAction(err)),
          ])
        )
    );
}
