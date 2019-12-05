import {forwardRef, Inject} from '@angular/core';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {AppSettings} from 'app/app.settings';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {CustomerInfoSandbox} from 'app/core/sandboxes/customer-info.sandbox';
import {CustomerInfo} from 'app/core/store/customer-info/customer-info.interface';
import {Definition} from 'app/core/store/definitions/definition.interface';
import {GetDefinitionsGuard} from 'app/core/store/definitions/definitions.resolve';
import * as selectCustomerActions from 'app/core/store/select-customer/select-customer.actions';
import {logger} from 'app/core/util/logger';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '../store';
import {BaseGuard} from './base.guard';

interface StateDate {
  customerInfo: CustomerInfo;
  activeCustomer: Definition;
}

export class CustomerInfoLoadIfSelectedGuard extends BaseGuard<StateDate> implements DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;
  private sandbox: CustomerInfoSandbox;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => CustomerInfoSandbox)) sandbox) {
    super('CustomerInfoLoadGuard');
    this.store = store;
    this.sandbox = sandbox;
  }

  getState(): Observable<StateDate> {
    return this.store.map(state => {
      return {
        customerInfo: state.customerInfo,
        activeCustomer: state.session.activeCustomer
      };
    });
  }

  hasFailed(t: StateDate): boolean {
    return t.customerInfo.failed;
  }

  isLoaded(t: StateDate): boolean {
    return !(t.activeCustomer && t.activeCustomer.id) || t.customerInfo.loaded;
  }

  isLoading(t: StateDate): boolean {
    return t.customerInfo.loading;
  }

  loader(params: { [p: string]: string }): void {
    logger.debug('In CustomerInfoLoadGuard loader');
    this.sandbox.loadCustomerInfo();
  }

  resetter(params: { [p: string]: string }): void {
    this.sandbox.resetCustomerInfo();
  }

  versionChecker(t: StateDate, params: { [p: string]: string }): boolean {
    return !(t.activeCustomer && t.activeCustomer.id) || t.customerInfo.customerId === (t.activeCustomer ? t.activeCustomer.id : '');
  }

  navigateAway(): void {
    this.sandbox.resetCustomerInfo();
    this.store.dispatch(new selectCustomerActions.ClearActiveCustomerAction());
    this.store.dispatch(go([AppSettings.SELECT_CUSTOMER_ROUTE]));
  }

  getDependencies() {
    return [GetDefinitionsGuard];
  }

  getDependencyRouteData() {
    return null; // Use original route-data
  }

  didntChange(v1: StateDate, v2: StateDate) {
    return v1.customerInfo.loaded === v2.customerInfo.loaded
      && v1.customerInfo.loading === v2.customerInfo.loading
      && v1.customerInfo.failed === v2.customerInfo.failed
      && v1.activeCustomer === v2.activeCustomer;
  }
}
