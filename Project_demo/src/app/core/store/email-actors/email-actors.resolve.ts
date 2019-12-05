import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {Definition} from '../definitions/definition.interface';
import {EmailActorsLoadAction} from './email-actors.actions';

/**
 * Guard to async load the email actors before following a route
 */
export class GetEmailActorsGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.take(1).map(state => state.customerInfo.authorization.ORDER.CREATE).switchMap(canCreateOrder => {
      return this.store.select('session').take(1).map((session: { activeCustomer: Definition }) => session.activeCustomer).switchMap(activeCustomer => {
        this.store.dispatch(new EmailActorsLoadAction(activeCustomer.id));
        return Observable.of(true);
      });
    });
  }

  getDependencies(): any {
    return [
      CustomerInfoLoadGuard
    ];
  }

  getDependencyRouteData(): any {
  }
}
