import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {ColdSubject} from 'app/core/guards/cold-subject';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {AuthenticationGuard} from 'app/core/services/adal/authenticated.guard';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {AppSettings} from '../../../app.settings';
import {AdalService} from '../../services/adal/adal.service';

/**
 * Guard that customer is selected
 */
export class SelectedCustomerGuard implements CanActivate, DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;
  private adalService: AdalService;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => AdalService)) adalService) {
    this.store = store;
    this.adalService = adalService;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new ColdSubject(() => {
      logger.debug('Inner AuthenticatedAndSelectedCustomerGuard');
      // Is authenticated ?
      return this.store.select('session').filter((session:any) => session.userContext.contextLoaded && session.activeCustomer).take(1).map((session: any) => {
        // Has active customer ?
        const hasActiveCustomer = !!(session.activeCustomer.id);
        if (!hasActiveCustomer) {
          this.store.dispatch(go(AppSettings.SELECT_CUSTOMER_ROUTE));
        }
        return hasActiveCustomer;
      });
    });
  }

  getDependencies(): any {
    return [AuthenticationGuard];
  }

  getDependencyRouteData(): any {
  }
}
