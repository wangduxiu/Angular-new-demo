import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {UserContextLoadGuard} from 'app/core/guards/user-context-load.guard';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '../store';
import {AdminDefinitionsLoadAction} from '../store/admin/admin-definitions/admin-definitions.actions';
import {AdminDefinitions} from '../store/admin/admin-definitions/admin-definitions.interface';
import {RootState} from '../store/index';

export class AdminDefinitionsGuard implements CanActivate, DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.store
      .filter((root: fromRoot.RootState) => root.session.userContext.contextLoaded)
      .take(1)
      .switchMap((root: RootState) => {
        logger.debug('inner GetAdminDefinitionsGuard');
        if (root.admin.adminDefinitions.loaded)
          return Observable.of(true);

        this.store.dispatch(new AdminDefinitionsLoadAction({ language: root.session.userContext.language }));
        return this.store.select(store => store.admin.adminDefinitions)
          .filter((definitions: AdminDefinitions) => definitions.loaded)
          .take(1)
          .switchMap(() => Observable.of(true));
      });
  }

  getDependencies() {
    return [UserContextLoadGuard, AuthorizationGuard];
  }

  getDependencyRouteData() {
    return { authorization: 'isAdmin' };
  };
}
