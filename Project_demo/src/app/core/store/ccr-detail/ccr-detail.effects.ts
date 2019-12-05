import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import { Observable } from 'rxjs/Observable';
import { RootState } from '..';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';
import { CCRRestService } from '../../services/rest/ccr.rest.service';
import { OrderRestService } from '../../services/rest/order.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import * as actions from './ccr-detail.actions';

@Injectable()
export class CCRDetailEffects extends AbstractEffects {

  constructor(private store: Store<RootState>, azureMonitoringService: AzureMonitoringService, private actions$: Actions, private orderRestService: OrderRestService, translateService: TranslateService, private ccrRestService: CCRRestService) {
    super(translateService, azureMonitoringService);
  }

  @Effect() createCCR$: Observable<Action>
    = this.actions$
    .ofType(actions.CCRDETAIL_CREATE_SUBMIT)
    .debounceTime(50)
    .withLatestFrom(this.store, (action, state) => {
      return { action, state };
    })
    .switchMap(actionAndState => {
      return this.ccrRestService
        .createCCR(actionAndState.action.payload)
        .switchMap((result) => {
          return Observable.from([
            new actions.CCRDetailCreateSubmitSuccess({ result }),
          ]);
        })
        .catch(err => this.handleFail(err, 'Submit ccr', [
            Observable.of(new actions.CCRDetailCreateSubmitFail(err))
          ])
        );
    });
}
