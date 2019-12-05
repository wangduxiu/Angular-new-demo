import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {UserContext} from 'app/core/store/user-context/user-context.interface';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {AppSettings} from '../../../app.settings';
import {AdalService} from '../../services/adal/adal.service';
import {CustomerInfoLoadIfSelectedGuard} from '../../guards/customer-info-load-if-selected.guard';

/**
 * Guard that customer is selected
 */
export class AuthorizationGuard implements CanActivate, DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;
  private adalService: AdalService;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => AdalService)) adalService, @Inject(forwardRef(() => CustomerInfoLoadGuard)) customerInfoLoadGuard) {
    this.store = store;
    this.adalService = adalService;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    logger.debug('In AuthorizationGuard');
    // Is authenticated ?
    if (!this.adalService.isAuthenticated) {
      this.store.dispatch(go(AppSettings.PUBLIC_PAGE_ROUTE));
      return Observable.of(false);
    }

    let authorizationChecker: (userContext: UserContext) => boolean;
    switch (route.data.authorization) {
      case 'isAdmin':
        authorizationChecker = userContext => userContext.isAdmin;
        break;
      case 'isAgent':
        authorizationChecker = userContext => userContext.isAgent;
        break;
      case 'canRelocate':
        authorizationChecker = userContext => userContext.canRelocate;
        break;
      case 'useEmailActors':
        authorizationChecker = userContext => userContext.useEmailActors;
        break;
      case 'inviteEpsUser':
        authorizationChecker = userContext => userContext.isAdmin && userContext.adminRoles.inviteEpsUser;
        break;
      case 'inviteClientUser':
        authorizationChecker = userContext => userContext.isAdmin && userContext.adminRoles.inviteClientUser;
        break;
      case 'createClientUser':
        authorizationChecker = userContext => userContext.isAdmin && userContext.adminRoles.createClientUser;
        break;
      case 'updateEpsUser':
        authorizationChecker = userContext => userContext.isAdmin && userContext.adminRoles.updateEpsUser;
        break;
      case 'updateClientUser':
        authorizationChecker = userContext => userContext.isAdmin && userContext.adminRoles.updateClientUser;
        break;
    }

    if (authorizationChecker) {
      return this.store
        .filter((root: fromRoot.RootState) => root.session.userContext.contextLoaded)
        .take(1)
        .switchMap(root => {
          return Observable.of(authorizationChecker(root.session.userContext));
        })
    } else {
      return this.store.take(1).switchMap(state => {
        const authorizationPath = route.data.authorization.split('.');
        const isAuthorized = authorizationPath.reduce((a, pathPart) => {
          return a && a[pathPart];
        }, state.customerInfo.authorization);
        return Observable.of(!!isAuthorized);
      });
    }
  }

  getDependencies(): any {
    return [CustomerInfoLoadIfSelectedGuard];
  }

  getDependencyRouteData(): any {
    return {}
  }
}
