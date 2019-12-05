import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {GetAdminDefinitionsGuard} from 'app/core/store/admin/admin-definitions/admin-definitions.resolve';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '../..';
import {ClientUserLoadAction, StartCreateClientUserAction, StartInviteClientUserAction} from './users.actions';

/**
 * Guard to async load an order before following a route
 */
export class GetClientUserGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.store.dispatch(new ClientUserLoadAction(route.params.id));
    return this.store.select('admin').filter((admin: any) => !admin.edit.loading)
      .take(1)
      .map((admin: any) => admin.edit.loadSuccess);
  }

  getDependencies(): any {
    return [GetAdminDefinitionsGuard]
  }

  getDependencyRouteData(): any {
  }
}

export class InviteClientUserGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.store.dispatch(new StartInviteClientUserAction());
    return true;
  }

  getDependencies(): any {
    return [GetAdminDefinitionsGuard]
  }

  getDependencyRouteData(): any {
  }
}

export class CreateClientUserGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.store.dispatch(new StartCreateClientUserAction());
    return true;
  }

  getDependencies(): any {
    return [
      GetAdminDefinitionsGuard,
      AuthorizationGuard
    ]
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'createClientUser'
    }
  }
}
