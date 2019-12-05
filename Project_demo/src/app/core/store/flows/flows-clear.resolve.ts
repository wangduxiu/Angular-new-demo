import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {FlowsClearAction} from './flows.actions';
import {ColdSubject} from '../../guards/cold-subject';
import {logger} from '../../util/logger';
import {CustomerInfoLoadGuard} from '../../guards/customer-info-load.guard';

/**
 * Guard to synchronously clear orders filter & result
 */
export class ClearFlowsFilterGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new ColdSubject(() => {
      logger.debug('Inner ClearFlowsFilterGuard');
      this.store.dispatch(new FlowsClearAction());
      this.store.dispatch(go('flows'));
      return true;
    })
  }

  getDependencies(): any {
    return [CustomerInfoLoadGuard, AuthorizationGuard];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'FLOW.QUERY'
    };
  }
}
