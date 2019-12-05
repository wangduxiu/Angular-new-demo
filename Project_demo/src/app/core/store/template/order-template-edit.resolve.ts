import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {ColdSubject} from 'app/core/guards/cold-subject';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {OrderFilterValuesLoadGuard} from 'app/core/guards/order-filter-values-load.guard';
import {OrderSandbox} from 'app/core/sandboxes/order.sandbox';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';

/**
 * Guard to async load a template before following a route
 */
export class EditOrderTemplateGuard implements CanActivate, DependencyTreeCanActivate {
  private sandbox: OrderSandbox;

  constructor(@Inject(forwardRef(() => OrderSandbox)) sandbox,) {
    this.sandbox = sandbox;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    logger.debug('in EditOrderTemplateGuard');
    return new ColdSubject(() => this.sandbox.editTemplate(route.params.templateId));
  }

  getDependencies(): any {
    return [
      OrderFilterValuesLoadGuard,
      AuthorizationGuard,
    ];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'ORDER.CREATE_TEMPLATE'
    }
  }

}
