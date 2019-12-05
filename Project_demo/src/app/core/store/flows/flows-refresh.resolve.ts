import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {FlowsLoadAction} from './flows.actions';
import {CustomerInfoLoadGuard} from '../../guards/customer-info-load.guard';

/**
 * Guard to synchronously clear orders filter & result
 */
export class RefreshFlowsFilterGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    logger.debug('In flows-refresh.resolve');
    this.store.dispatch(new FlowsLoadAction());
    this.store.dispatch(go('flows'));
    return false;
  }

  getDependencies(): any {
    return [CustomerInfoLoadGuard, AuthorizationGuard];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'FLOW.QUERY'
    }
  }
}
