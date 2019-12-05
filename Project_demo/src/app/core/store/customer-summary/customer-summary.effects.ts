import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { RootState } from '../';
import { AdalService } from '../../services/adal/adal.service';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';
import { CustomersRestService } from '../../services/rest/customers.rest.service';
import { StockRestService } from '../../services/rest/stock.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import * as actions from './customer-summary.actions';
import { CustomerSummaryMW } from './customer-summary.interface';

@Injectable()
export class CustomerSummaryEffects extends AbstractEffects {

  constructor(private store: Store<RootState>,
    azureMonitoringService: AzureMonitoringService,
    private actions$: Actions,
    private customersRestService: CustomersRestService,
    private stockRestService: StockRestService,
    translateService: TranslateService,
    private adalService: AdalService,
    private router: Router) {
    super(translateService, azureMonitoringService);
  }

  @Effect() loadCustomerSummary$: Observable<{}>
  = this.actions$
    .ofType(actions.CUSTOMER_SUMMARY_LOAD)
    .filter(action => this.adalService.isAuthenticated)
    .withLatestFrom(this.store, (action, state) => {
      return { state };
    })
    .switchMap(({ state }) => {
      return this.customersRestService.getCustomerSummary(state.session.activeCustomer && state.session.activeCustomer.id)
        .map((customerSummary: CustomerSummaryMW) => {
          return new actions.CustomerSummarySuccessAction({ customerSummary });
        })
        .catch((err) => this.handleFail(err, 'Get customer summary', [Observable.of(new actions.CustomerSummaryFailAction(err))]));
    });

  @Effect() loadCustomerStock$: Observable<{}> = this.actions$
    .ofType(actions.CUSTOMER_STOCK_LOAD)
    .withLatestFrom(this.store, (action, state) => {
      return { state };
    })
    .switchMap(({ state }) => {
      return this.stockRestService.getCustomerStock(state.session.activeCustomer && state.session.activeCustomer.id)
        .map((stock) => {
          return new actions.CustomerStockLoadSuccessAction({ stock });
        })
        .catch(err => {
          // don't show error anymore.  It's annoying...
          // return this.handleFail(err, 'Get Latest Flows', [Observable.of(new actions.CustomerStockLoadFailAction(err))])
          return Observable.of(new actions.CustomerStockLoadFailAction(err));
        });
    });
}
