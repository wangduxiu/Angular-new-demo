import { forwardRef, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { DependencyTreeCanActivate } from 'app/core/guards/dependency-tree.guard';
import { OrderFilterValuesLoadGuard } from 'app/core/guards/order-filter-values-load.guard';
import { AuthorizationGuard } from 'app/core/store/select-customer/authorization.resolve';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '..';
import { OrderDetailOpen } from './order-detail.actions';
import { EditOrderDetail } from './order-detail.interface';

/**
 * Guard to async load an order before following a route
 */
export class GetOrderGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;

  constructor(@Inject(forwardRef(() => Store)) store) {
    this.store = store;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    // return this.store.take(1).map(state => state.customerInfo.authorization.ORDER.GET).switchMap(canOpenOrder => {
    return this.store.take(1).switchMap(state => {
      if (!state.customerInfo.authorization.ORDER.GET) {
        this.store.dispatch(go('/'));
        return Observable.of(false);
      }

      // cr127: if multiple customer query, the selected customerId in header may not be the owner of the order, then this customerIds array will be used
      const customerIds = state.session.userContext.isTransporter ? state.session.userContext.customers.map(c => c.id) : [];
      this.store.dispatch(new OrderDetailOpen({
        salesOrderNumber: route.params.salesOrderNumber !== 'null' && route.params.salesOrderNumber !== 'undefined' ? route.params.salesOrderNumber : null,
        etmOrderNumber: route.params.etmOrderNumber,
        customerIds
      }));
      return this.store
        .select('editOrderDetail')
        .filter((editOrderDetail: EditOrderDetail) => !editOrderDetail.mode.loading)
        .take(1)
        .map((editOrderDetail: EditOrderDetail) => editOrderDetail.mode.loadSuccess);
    });
  }

  getDependencies(): any {
    return [
      OrderFilterValuesLoadGuard,
      AuthorizationGuard,
    ];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'ORDER.GET'
    }
  }
}
