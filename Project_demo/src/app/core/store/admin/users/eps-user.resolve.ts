import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {AdminDefinitionsGuard} from 'app/core/guards/admin-definitions.guard';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '../..';
import {EpsUserLoadAction, StartCreateEpsUserAction, StartInviteEpsUserAction} from './users.actions';

/**
 * Guard to async load an order before following a route
 */
export class GetEpsUserGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.store.dispatch(new EpsUserLoadAction(route.params.id));
    return this.store.select('admin').filter((admin: any) => !admin.edit.loading)
      .take(1)
      .map((admin: any) => admin.edit.loadSuccess);
  }

  getDependencies(): any {
    return [AdminDefinitionsGuard]
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'updateEpsUser'
    }
  }
}

export class InviteEpsUserGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.store.dispatch(new StartInviteEpsUserAction());
    return true;
  }

  getDependencies(): any {
    return [
      AdminDefinitionsGuard,
      AuthorizationGuard
    ];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'inviteEpsUser'
    }
  }
}

export class CreateEpsUserGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.store.dispatch(new StartCreateEpsUserAction());
    return true;
  }

  getDependencies(): any {
    return [AdminDefinitionsGuard]
  }

  getDependencyRouteData(): any {
  }
}
