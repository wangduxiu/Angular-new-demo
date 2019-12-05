import {forwardRef, Inject} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {DependencyTreeCanActivate} from 'app/core/guards/dependency-tree.guard';
import {OrderFilterValuesLoadGuard} from 'app/core/guards/order-filter-values-load.guard';
import {OrderSandbox} from 'app/core/sandboxes/order.sandbox';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {Observable} from 'rxjs/Observable';
import * as fromRoot from '..';
import {TemplateRestService} from '../../services/rest/template.rest.service';
import {CDFlorderType, CDTo} from '../contract-details/contract-details.interface';
import {OrderDetailTO} from '../florder-detail/florder-detail.interface';

/**
 * Guard to async load an order before following a route
 */
export class CreateOrderFromTemplateGuard implements CanActivate, DependencyTreeCanActivate {
  private templateRestService: TemplateRestService;
  private store: Store<fromRoot.RootState>;
  private customerInfoLoadGuard: CustomerInfoLoadGuard;
  private sandbox: OrderSandbox;

  constructor(@Inject(forwardRef(() => Store)) store, @Inject(forwardRef(() => CustomerInfoLoadGuard)) customerInfoLoadGuard, @Inject(forwardRef(() => TemplateRestService)) templateRestService, @Inject(forwardRef(() => OrderSandbox)) sandbox) {
    this.store = store;
    this.customerInfoLoadGuard = customerInfoLoadGuard;
    this.templateRestService = templateRestService;
    this.sandbox = sandbox;
  }

  private findTo(florderTypes: CDFlorderType[], template: OrderDetailTO): CDTo {
    const orderType: CDFlorderType = florderTypes.find(orderType => orderType.id === template.orderType);
    const shippingCondition = orderType && orderType.shippingConditions.find(shippingCondition => shippingCondition.id === template.transport);
    const from = shippingCondition && shippingCondition.froms.find(from => from.id === template.from.id);
    return from && from.tos.find(to => to.id === template.to.id);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.customerInfoLoadGuard.canActivate(route, state).take(1).switchMap(customerInfoLoaded => {
      return this.store
        .take(1)
        .switchMap(state => {
          if (!state.customerInfo.authorization.ORDER.CREATE) {
            this.store.dispatch(go('/'));
            return Observable.of(false);
          }

          this.sandbox.createOrderFromTemplate({
            templateId: route.params.templateId,
            date: route.queryParams.date
          });

          return Observable.of(false);
        });
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
      authorization: 'ORDER.CREATE'
    }
  }
}
