import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {UserContextLoadGuard} from 'app/core/guards/user-context-load.guard';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '../..';
import {RootState} from '../../index';
import {AdminDefinitionsLoadAction} from './admin-definitions.actions';
import {AdminDefinitions} from './admin-definitions.interface';

/**
 * Guard to async load the definitions before following a route
 */
export class GetAdminDefinitionsGuard implements CanActivate, DependencyTreeCanActivate {

  private store:Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    logger.debug('In GetAdminDefinitionsGuard');
    return this.store
      .take(1)
      .switchMap((root: RootState) => {
      if (root.admin.adminDefinitions.loaded)
        return Observable.of(true);

      this.store.dispatch(new AdminDefinitionsLoadAction({ language: root.session.userContext.language }));
      return this.store.select('admin')
        .map((admin:any) => admin.adminDefinitions)
        .filter((adminDefinitions2: AdminDefinitions) => adminDefinitions2.loaded)
        .take(1)
        .switchMap(() => Observable.of(true));
    });
  }

  getDependencies(): any {
    return [UserContextLoadGuard, AuthorizationGuard];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'isAdmin'
    }
  }
}
