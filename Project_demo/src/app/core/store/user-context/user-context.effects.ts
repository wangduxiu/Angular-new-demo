import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { AdalService } from '../../services/adal/adal.service';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';
import { CustomersRestService } from '../../services/rest/customers.rest.service';
import { UserContextRestService } from '../../services/rest/user-context.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import * as actions from './user-context.actions';
import { DefinitionsLoadAction } from '../definitions/definitions.actions';
import { AdminDefinitionsLoadAction } from '../admin/admin-definitions/admin-definitions.actions';
import { RootState } from '../index';

@Injectable()
export class UserContextEffects extends AbstractEffects {

  constructor(
    private store: Store<RootState>, 
    azureMonitoringService: AzureMonitoringService, 
    private actions$: Actions, 
    private userContextRestService: UserContextRestService, 
    private customersRestService: CustomersRestService, 
    private adalService: AdalService, translateService: TranslateService) {
    super(translateService, azureMonitoringService);
  }

  @Effect()
  loadUserContext$: Observable<Action>
    = this.actions$
    .ofType(actions.USERCONTEXT_LOAD)
    .debounceTime(50)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap((action) => {
      return this.userContextRestService.getUserContext()   // Request orders
        .map((userContext) => {
          return new actions.UserContextLoadSuccessAction(userContext);
        })
        .catch((err) => {
          // err.message = this.translateService.instant('ERRORS.AUTHORIZATION.USER_NOT_PORTAL_VALID');
          err.message = err.subMessage;
          return this.handleFail(err, 'Unauthorized', [
            Observable.of(new actions.UserContextLoadFailAction(err)),
          ]);
        });
      }
    );

  @Effect() loadCustomers$: Observable<Action>
    = this.actions$
    .ofType(actions.CUSTOMERS_LOAD)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap((action) => {
        return this.customersRestService.getSoldTosForSalesOrganisation(action.payload)   // Request customers
          .map((userContext) => {
            return new actions.CustomersLoadSuccessAction(userContext);
          })
          .catch((err) => {

              return this.handleFail(err, 'Get customers', [
                Observable.of(new actions.CustomersLoadFailAction(err))
              ]);
            }
          );
      }
    );
}
