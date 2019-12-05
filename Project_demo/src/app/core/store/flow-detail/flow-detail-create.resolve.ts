import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {FlowFilterValuesLoadGuard} from 'app/core/guards/flow-filter-values-load.guard';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {FlowDetailCreateStart} from './flow-detail.actions';

/**
 * Guard to async load a flow before following a route
 */
export class CreateFlowGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;
  private customerInfoLoadGuard: CustomerInfoLoadGuard;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => CustomerInfoLoadGuard)) customerInfoLoadGuard) {
    this.store = store;
    this.customerInfoLoadGuard = customerInfoLoadGuard;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.customerInfoLoadGuard.canActivate(route, state).take(1).switchMap(customerInfoLoaded => {
      return this.store.take(1).map(state => state.customerInfo.authorization.FLOW.CREATE).switchMap(canCreateFlow => {
        if (!canCreateFlow) {
          this.store.dispatch(go('/'));
          return Observable.of(false);
        }

        this.store.dispatch(new FlowDetailCreateStart());
        return Observable.of(true);
      });
    });
  }
  getDependencies(): any {
    return [FlowFilterValuesLoadGuard, AuthorizationGuard];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'FLOW.CREATE'
    }
  }
}
