import { forwardRef, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '..';
import { AppSettings } from '../../../app.settings';
import { ClearActiveCustomerAction } from './select-customer.actions';

/**
 * Guard to synchronously clear orders filter & result
 */
export class ClearCustomerGuard implements CanActivate {

  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    logger.debug('In ClearCustomerGuard');
    this.store.dispatch(new ClearActiveCustomerAction());
    this.store.dispatch(go(AppSettings.SELECT_CUSTOMER_ROUTE));
    return false;
  }
}
