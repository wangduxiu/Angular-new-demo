import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {Invoices} from '../../model/Invoice.interface';
import * as actions from './invoice.actions';

/**
 * Guard to async load the Descartes invoices url before following a route
 */
export class GetDescartesInvoicesUrlGuard implements CanActivate, DependencyTreeCanActivate {

  private store: Store<fromRoot.RootState>;
  private customerInfoLoadGuard: CustomerInfoLoadGuard;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => CustomerInfoLoadGuard)) customerInfoLoadGuard) {
    this.store = store;
    this.customerInfoLoadGuard = customerInfoLoadGuard;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.customerInfoLoadGuard.canActivate(route, state).take(1).switchMap(customerInfoLoaded => {
      if (!customerInfoLoaded) {
        this.store.dispatch(go('/'));
        return Observable.of(false);
      }
      return this.store.select('invoice').take(1).switchMap((invoice: Invoices) => {
        if (invoice.descartes.loadSuccess)
          return Observable.of(true);

        this.store.dispatch(new actions.DescartesInvoicesUrlLoadAction());
        return this.store.select('invoice')
          .filter((invoice: Invoices) => invoice.descartes.loadSuccess)
          .take(1)
          .switchMap(() => Observable.of(true));
      });
    });
  }

  getDependencies(): any {
    return [CustomerInfoLoadGuard, AuthorizationGuard];
  }

  getDependencyRouteData(): any {
    return {
      authorization: 'INVOICES.ACCESS'
    }
  }
}

