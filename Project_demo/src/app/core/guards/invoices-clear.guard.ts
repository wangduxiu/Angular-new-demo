import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {ColdSubject} from 'app/core/guards/cold-subject';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {InvoiceSandbox} from 'app/core/sandboxes/invoice.sandbox';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {logger} from 'app/core/util/logger';
import {Observable} from 'rxjs/Observable';
import {CustomerInfoLoadGuard} from './customer-info-load.guard';

/**
 * Guard to synchronously clear orders filter & result
 */
export class ClearInvoicesFilterGuard implements CanActivate, DependencyTreeCanActivate {

  private sandbox: InvoiceSandbox;

  constructor(@Inject(forwardRef(() => InvoiceSandbox)) sandbox: InvoiceSandbox) {
    this.sandbox = sandbox;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new ColdSubject(subject => {
      logger.debug('In ClearInvoicesFilterGuard');
      this.sandbox.clearInvoiceFilter();
      this.sandbox.goToInvoices();
      return true;
    })
  }

  getDependencies(): any {
    return [AuthorizationGuard, CustomerInfoLoadGuard];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'INVOICES.ACCESS'
    }
  }
}
