import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {OrderFilterValuesLoadGuard} from 'app/core/guards/order-filter-values-load.guard';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {OrderTemplateCreateStart} from 'app/core/store/template/template.actions';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {Definition} from '../definitions/definition.interface';
import {OrderDetailCreateStart} from './order-detail.actions';

/**
 * Guard to async load an order before following a route
 */
export class CreateOrderGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.store.take(1).switchMap(state => {
      if (!state.customerInfo.authorization.ORDER.CREATE) {
        this.store.dispatch(go('/'));
        return Observable.of(false);
      }

      return this.store.select('session').take(1).map((session: { activeCustomer: Definition }) => session.activeCustomer).switchMap(activeCustomer => {
        if (route.data.createTemplate) {
          this.store.dispatch(new OrderTemplateCreateStart({ activeCustomer }));
        } else {
          this.store.dispatch(new OrderDetailCreateStart({
            activeCustomer,
            date: route.queryParams && route.queryParams.date,
            restrictions: state.customerInfo.restrictions,
            preventCheckingContractDetails: route.data.preventCheckingContractDetails
          }));
        }
        return Observable.of(true);
      });
    });
  }

  getDependencies(): any {
    return [
      OrderFilterValuesLoadGuard,
      AuthorizationGuard
    ];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'ORDER.CREATE'
    }
  }
}
