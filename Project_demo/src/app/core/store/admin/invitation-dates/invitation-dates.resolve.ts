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
import * as actions from './invitation-dates.actions';
import {InvitationDates} from './invitation-dates.interface';

/**
 * Guard to async load the definitions before following a route
 */
export class GetInvitationDatesGuard implements CanActivate, DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    logger.debug('In GetInvitationDatesGuard');
    return this.store
      .filter((root: fromRoot.RootState) => root.session.userContext.contextLoaded)
      .take(1)
      .switchMap((root: RootState) => {
        if (root.admin.adminDefinitions.loaded)
          return Observable.of(true);

        this.store.dispatch(new actions.AdminInvitationDatesLoadClientAction());
        this.store.dispatch(new actions.AdminInvitationDatesLoadEpsAction());
        return this.store.select('admin')
          .debounceTime(100) // Wait 100 ms so that reducers were able to clear the date in the state
          .map((admin: any) => admin.dates)
          .filter((dates: InvitationDates) => dates.clientUserInvitationDate.loaded && dates.epsUserInvitationDate.loaded)
          .take(1)
          .switchMap(() => Observable.of(true));
      });
  }

  getDependencies(): any {
    return [UserContextLoadGuard, AuthorizationGuard];
  }

  getDependencyRouteData(): any {
    return {
      authorization: "isAgent"
    };
  }

}
