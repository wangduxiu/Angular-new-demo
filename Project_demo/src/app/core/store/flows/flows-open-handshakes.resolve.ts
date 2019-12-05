import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {GetDefinitionsGuard} from 'app/core/store/definitions/definitions.resolve';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {RootState} from '../';
import * as actions from './flows.actions';

/**
 * Guard to synchronously clear orders filter & result
 */
export class FlowsOpenHandshakesFilterGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;
  private customerInfoLoadGuard: CustomerInfoLoadGuard;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => CustomerInfoLoadGuard)) customerInfoLoadGuard) {
    this.store = store;
    this.customerInfoLoadGuard = customerInfoLoadGuard;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.customerInfoLoadGuard.canActivate(route, state).take(1).switchMap(customerInfoLoaded => {
      if (!customerInfoLoaded) {
        return Observable.of(false);
      }
      return this.store.take(1).switchMap((state: RootState) => {
        if (!state.customerInfo.authorization.FLOW.QUERY) {
          this.store.dispatch(go('/'));
          return Observable.of(false);
        }

        this.store.dispatch(new actions.FlowsSetFilterOpenHandshakesAction());
        this.store.dispatch(go(['/flows/refresh']));
        return Observable.of(false);
      });
    });
  }

  getDependencies(): any {
    return [CustomerInfoLoadGuard, AuthorizationGuard, GetDefinitionsGuard];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'FLOW.QUERY'
    }
  }
}
