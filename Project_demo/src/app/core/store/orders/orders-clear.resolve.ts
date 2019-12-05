import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {ColdSubject} from 'app/core/guards/cold-subject';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {OrderFilterValuesLoadGuard} from 'app/core/guards/order-filter-values-load.guard';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {OrdersClearAction} from './orders.actions';

/**
 * Guard to synchronously clear orders filter & result
 */
export class ClearOrdersFilterGuard implements CanActivate, DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new ColdSubject(() => {
      logger.debug('Inner ClearOrdersFilterGuard');
      this.store.dispatch(new OrdersClearAction());
      this.store.dispatch(go('orders'));
      return true;
    })
  }

  getDependencies(): any {
    return [OrderFilterValuesLoadGuard];
  }

  getDependencyRouteData(): any {
  }
}
