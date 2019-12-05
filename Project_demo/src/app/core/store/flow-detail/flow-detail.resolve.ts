import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {ColdSubject} from 'app/core/guards/cold-subject';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {FlowSandbox} from 'app/core/sandboxes/flow.sandbox';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';

/**
 * Guard to async load a flow before following a route
 */
export class GetFlowGuard implements CanActivate, DependencyTreeCanActivate {
  private store: Store<fromRoot.RootState>;
  private sandbox: FlowSandbox;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => FlowSandbox)) sandbox,) {
    this.store = store;
    this.sandbox = sandbox;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new ColdSubject(() => {
      return this.sandbox.openFlow(route.params.etmOrderNumber, route.queryParams.salesOrderNumber);
    });
  }

  getDependencies(): any {
    return [
      CustomerInfoLoadGuard,
      AuthorizationGuard
    ];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'FLOW.GET'
    }
  }
}
