import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { CustomerInfoTO } from 'app/core/store/customer-info/customer-info.interface';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { RootState } from '../';
import { AppSettings } from '../../../app.settings';
import { AdalService } from '../../services/adal/adal.service';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';
import { ContractDetailsRestService } from '../../services/rest/contract-details.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import * as actions from './customer-info.actions';

@Injectable()
export class CustomerInfoEffects extends AbstractEffects {

  constructor(private store: Store<RootState>, azureMonitoringService: AzureMonitoringService, private actions$: Actions, private contractDetailsRestService: ContractDetailsRestService, translateService: TranslateService, private adalService: AdalService, private router: Router) {
    super(translateService, azureMonitoringService);
  }

  @Effect() loadCustomerInfo$: Observable<any> = this.actions$
    .ofType(actions.CUSTOMER_INFO_LOAD + '_DISABLED')
    .filter(action => this.adalService.isAuthenticated)
    .withLatestFrom(this.store, (actions, state) => {
      return { state };
    })
    .switchMap(({ state }) => {
      return this.contractDetailsRestService.getCustomerInfo(state.session.activeCustomer && state.session.activeCustomer.id)
        .withLatestFrom(this.store, (customerInfo: CustomerInfoTO, state) => {
          return { customerInfo, state };
        })
        .switchMap(({ customerInfo, state }) => {
          return Observable.of(new actions.CustomerInfoLoadSuccessAction({
            customerInfo,
            isAdmin: state.session.userContext.isAdmin,
            isAgent: state.session.userContext.isAgent,
            isEpsUser: state.session.userContext.isEpsUser,
            canRelocate: state.session.userContext.canRelocate,
            useEmailActors: state.session.userContext.useEmailActors,
            isTransporter: state.session.userContext.isTransporter,
            definitions: state.definitions,
            adminRoles: state.session.userContext.adminRoles,
          }));
        })
        .catch((err) => {
          return this.handleFail(err, 'Get customer info', [Observable.of(new actions.CustomerInfoLoadFailAction(err))]);
        });
    });

  @Effect({ dispatch: false }) customerInfoLoadSuccess$: Observable<{}> = this.actions$
    .ofType(actions.CUSTOMER_INFO_LOAD_SUCCESS + '_DISABLED')
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(() => {
      if (this.router.url === '/' + AppSettings.SELECT_CUSTOMER_ROUTE) {
        this.store.dispatch(go(AppSettings.DEFAULT_ROUTE));
      }
      return Observable.of({}); // you have to return an observable, even if it won't be dispatched
    });

}
