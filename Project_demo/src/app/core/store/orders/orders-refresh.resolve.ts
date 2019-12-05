import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {OrderFilterValuesLoadGuard} from 'app/core/guards/order-filter-values-load.guard';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {OrdersLoadAction} from './orders.actions';

/**
 * Guard to synchronously clear orders filter & result
 */
export class RefreshOrdersFilterGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    logger.debug('In RefreshOrdersFilterGuard');
    this.store.dispatch(new OrdersLoadAction());
    this.store.dispatch(go('orders'));
    return false;
  }

  getDependencies(): any {
    return [OrderFilterValuesLoadGuard];
  }

  getDependencyRouteData(): any {
  }
}
