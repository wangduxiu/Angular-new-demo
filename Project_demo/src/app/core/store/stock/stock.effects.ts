import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { go } from '@ngrx/router-store';

import { Stock } from '../stock/stock.interface';
import * as actions from './stock.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import { RootState } from '..';
import { StockRestService } from '../../services/rest/stock.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import { TranslateService } from '@ngx-translate/core';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';

@Injectable()
export class StockEffects extends AbstractEffects {

  constructor(private store: Store<RootState>, azureMonitoringService: AzureMonitoringService, private actions$: Actions, private stockRestService: StockRestService, translateService: TranslateService) {
    super(translateService, azureMonitoringService);
  }

  @Effect()
  loadStock$: Observable<Action> = this.actions$
    .ofType(actions.STOCK_LOAD)
    .debounceTime(50)
    .withLatestFrom(this.store, (action, state) => {
      return { payload: action.payload, state };
    })
    .switchMap(({ payload, state }) => // Register to this event, unregister previous if new event occurs.
      this.stockRestService.getStock(payload.filter)   // Request stock
        .map(stockArray =>
          new actions.StockLoadSuccessAction(Object.assign({}, stockArray, {
              definitions: state.definitions,
              places: state.contractDetails.places,
              filter: payload.filter,
            })))
        .catch((err) => this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
          Observable.of(new actions.StockLoadFailAction(err)),
        ])
        )
    );

    @Effect() loadPowerBIUrl$: Observable<Action>
      = this.actions$
          .ofType(actions.POWER_BI_URL_LOAD)
          .debounceTime(50)
          .switchMap(() => {
            return this.stockRestService.getPowerBIUrl()
                       .map(result => new actions.PowerBIUrlLoadSuccessAction(result))
                       .catch((err) => this.handleFail(err, 'Load Power BI URL', [
                         Observable.of(new actions.PowerBIUrlLoadFailAction(err))
                       ])
                       );
          });
}
