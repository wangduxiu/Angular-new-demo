import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {ColdSubject} from 'app/core/guards/cold-subject';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {OrderSandbox} from 'app/core/sandboxes/order.sandbox';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';

/**
 * Guard to async load a ccr order before following a route
 */
export class GetCCRGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;
  private customerInfoLoadGuard: CustomerInfoLoadGuard;
  private sandbox: OrderSandbox;

  constructor(
    @Inject(forwardRef(() => Store)) store,
    @Inject(forwardRef(() => OrderSandbox)) sandbox,
    ) {
    this.store = store;
    this.sandbox = sandbox;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new ColdSubject(() => this.sandbox.openCcrDetail({ salesOrderNumber: route.queryParams.salesOrderNumber, etmOrderNumber: route.params.etmOrderNumber }));
  }

  getDependencies(): any {
    return [CustomerInfoLoadGuard, AuthorizationGuard];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'ORDER.UPDATE'
    }
  }
}
