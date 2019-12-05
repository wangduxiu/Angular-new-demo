import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/bindCallback';
import { ADAL_LOGIN, ADAL_LOGIN_SUCCESS, ADAL_LOGOUT } from './adal.actions';
import { AdalService } from '../../services/adal/adal.service';
import { UserContextLoadAction } from '../user-context/user-context.actions';
import { ClearActiveCustomerAction } from '../select-customer/select-customer.actions';
import { Adal } from './adal.interface';

@Injectable()
export class AdalEffects {

  constructor(private store: Store<Adal>, private actions$: Actions, private adalService: AdalService) {
  }

  @Effect({dispatch:false})
  login$: Observable<Action> = this.actions$
    .ofType(ADAL_LOGIN)
    .switchMap((action) => {
      this.adalService.login();
      return null;
    },
  );

  @Effect()
  loginSuccess$: Observable<Action> = this.actions$
    .ofType(ADAL_LOGIN_SUCCESS)
    .switchMap((action) => {
      return Observable.of(new UserContextLoadAction());
    },
  );

  @Effect({dispatch:false})
  logout$: Observable<Action> = this.actions$
    .ofType(ADAL_LOGOUT)
    .switchMap((action) => {
      this.store.dispatch(new ClearActiveCustomerAction());
      this.adalService.logout();
      return null;
    }
  );

}
