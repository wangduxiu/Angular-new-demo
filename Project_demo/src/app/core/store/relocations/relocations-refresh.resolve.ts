import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {GetDefinitionsGuard} from 'app/core/store/definitions/definitions.resolve';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {RelocationsLoadAction} from './relocations.actions';

/**
 * Guard to refresh relocations list
 */
export class RefreshRelocationsFilterGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.store.dispatch(new RelocationsLoadAction());
    this.store.dispatch(go('relocations'));
    return false;
  }
  getDependencies(): any {
    return [
      AuthorizationGuard,
      GetDefinitionsGuard,
    ];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'canRelocate'
    }
  }
}
