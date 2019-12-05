import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {AuthenticationGuard} from 'app/core/services/adal/authenticated.guard';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {AppSettings} from '../../../app.settings';

/**
 * Guard that customer is selected
 */
export class NotSelectedCustomerGuard implements CanActivate, DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    logger.debug('In NotSelectedCustomerGuard');
    return this.store.select('session').map((session: any) => {
      const hasActiveCustomer = !!(session.activeCustomer && session.activeCustomer.id);
      if (hasActiveCustomer) {
        this.store.dispatch(go(AppSettings.DEFAULT_ROUTE));
      }
      return !hasActiveCustomer;
    });
  }

  getDependencies(): any {
    return [AuthenticationGuard];
  }

  getDependencyRouteData(): any {
  }
}
