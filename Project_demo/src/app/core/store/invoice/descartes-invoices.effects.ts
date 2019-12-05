import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/of';
import * as actions from './invoice.actions';
import { RootState } from '..';
import { InvoicesRestService } from '../../services/rest/invoices.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import { TranslateService } from '@ngx-translate/core';
import { go } from '@ngrx/router-store';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';

@Injectable()
export class DescartesInvoicesEffects extends AbstractEffects {

  constructor(private store: Store<RootState>, azureMonitoringService: AzureMonitoringService, private actions$: Actions, private invoicesRestService: InvoicesRestService, translateService: TranslateService) {
    super(translateService, azureMonitoringService);
  }

  @Effect() loadDescartesInvoicesUrl$: Observable<Action>
    = this.actions$
        .ofType(actions.DESCARTES_INVOICES_URL_LOAD)
        .debounceTime(50)
        .switchMap(() => {
          return this.invoicesRestService.getExternalUrl()
                     .map(result => new actions.DescartesInvoicesUrlLoadSuccessAction(result))
                     .catch((err) => this.handleFail(err, 'Load Descartes Invoices URL', [
                       Observable.of(new actions.DescartesInvoicesUrlLoadFailAction(err))
                     ])
                     );
        });

}
