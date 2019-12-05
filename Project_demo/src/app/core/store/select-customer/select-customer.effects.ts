import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Actions, Effect} from '@ngrx/effects';
import {go} from '@ngrx/router-store';
import {Action, Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {CookieService} from 'ngx-cookie';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from '../../../app.settings';
import {AdalService} from '../../services/adal/adal.service';
import {AzureMonitoringService} from '../../services/AzureMonitoringService';
import {AbstractEffects} from '../AbstractEffects';
import {DefinitionsLoadAction} from '../definitions/definitions.actions';
import {RootState} from '../index';
import {CustomerInfoSandbox} from 'app/core/sandboxes/customer-info.sandbox';
import * as userContextActions from '../user-context/user-context.actions';
import * as selectCustomerActions from './select-customer.actions';

@Injectable()
export class SelectCustomerEffects extends AbstractEffects {

  constructor(
    private store: Store<RootState>,
    azureMonitoringService: AzureMonitoringService,
    private actions$: Actions,
    private adalService: AdalService,
    translateService: TranslateService,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    private router: Router,
    private sandbox: CustomerInfoSandbox,
  ) {
    super(translateService, azureMonitoringService);
  }

  @Effect({ dispatch: false })
  getContractDetailsOrGotoSelectCustomer$: Observable<Action>
    = this.actions$
          .ofType(userContextActions.USERCONTEXT_LOAD_SUCCESS)
          .debounceTime(50)
          .filter(action => this.adalService.isAuthenticated)
          .withLatestFrom(this.store, (action, state) => {
            return { payload: action.payload, state };
          })
          .switchMap(({ state }) => {
            // Check cookie
            const activeCustomer = this.cookieService.getObject('epswebportal.activeCustomer') as { id: string, name: string };

            if (!activeCustomer) {
              this.store.dispatch(new selectCustomerActions.ClearActiveCustomerAction());
            }

            return Observable.of(null);
          });

  @Effect()
  clearActiveCustomer$: Observable<Action>
    = this.actions$
          .ofType(selectCustomerActions.CLEAR_ACTIVE_CUSTOMER)
          .switchMap(() => {
            this.cookieService.remove('epswebportal.activeCustomer');
            return Observable.of(go(AppSettings.SELECT_CUSTOMER_ROUTE));
          });

  @Effect({ dispatch: false })
  setActiveCustomer$: Observable<Action>
    = this.actions$
          .ofType(selectCustomerActions.SET_ACTIVE_CUSTOMER)
          .withLatestFrom(this.store, (action, state) => {
            return { payload: action.payload, state };
          })
          .switchMap(({ state }) => {
            const in4hours = moment().add(4, 'hours');
            this.cookieService.putObject('epswebportal.activeCustomer', state.session.activeCustomer, { expires: in4hours.toDate() });

            this.sandbox.loadCustomerInfo();

            return Observable.of(null);
          });

  @Effect({ dispatch: false })
  loadDefinitions$: Observable<Action>
    = this.actions$
    .ofType(selectCustomerActions.SET_ACTIVE_CUSTOMER)
    .withLatestFrom(this.store, (action, state) => {
      return { language:  state.session.userContext.language };
    })
    .switchMap(({language}) => {
      this.store.dispatch(new DefinitionsLoadAction({ language }));
      return Observable.of(null);
    });
}
