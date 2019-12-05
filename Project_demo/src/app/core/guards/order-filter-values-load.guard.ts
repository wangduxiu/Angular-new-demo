import {forwardRef, Inject} from '@angular/core';
import {CanActivate} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {OrdersSandbox} from 'app/core/sandboxes/orders.sandbox';
import {FilterValues} from 'app/core/store/florders/filtervalues.interface';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '../store';
import {BaseGuard} from './base.guard';

export class OrderFilterValuesLoadGuard extends BaseGuard<FilterValues> implements CanActivate, DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;
  private sandbox: OrdersSandbox;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => OrdersSandbox)) sandbox) {
    super('OrderFilterValuesLoadGuard');
    this.store = store;
    this.sandbox = sandbox;
  }

  getState(): Observable<FilterValues> {
    return this.store.map(state => state.orders.filterValues);
  }

  hasFailed(t: FilterValues): boolean {
    return t.failed;
  }

  isLoaded(t: FilterValues): boolean {
    return t.loaded;
  }

  isLoading(t: FilterValues): boolean {
    return t.loading;
  }

  loader(params: { [p: string]: string }): void {
    this.sandbox.loadOrdersFilterValues();
  }

  resetter(params: { [p: string]: string }): void {
    this.sandbox.resetOrdersFilterValues();
  }

  versionChecker(t: FilterValues, params: { [p: string]: string }): boolean {
    let activeCustomerId = '';
    // Simple subscribe = synchronous.
    this.store.take(1).subscribe(state => activeCustomerId = state.session.activeCustomer.id);

    return t.customerId === activeCustomerId;
  }

  navigateAway(): void {
    this.store.dispatch(go(['/']));
  }

  getDependencies(): any {
    return [AuthorizationGuard, CustomerInfoLoadGuard];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'ORDER.QUERY'
    };
  }

}
