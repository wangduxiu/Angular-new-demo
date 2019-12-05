import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import {OrderFilterValuesLoadGuard} from 'app/core/guards/order-filter-values-load.guard';
import {AuthorizationGuard} from 'app/core/store/select-customer/authorization.resolve';
import {EditOrderTemplateGuard} from 'app/core/store/template/order-template-edit.resolve';
import 'rxjs/add/operator/distinctUntilChanged';
import {AdalModule} from '../../core/services/adal/adal.module';
import {GetEmailActorsGuard} from '../../core/store/email-actors/email-actors.resolve';
import {CreateOrderFromTemplateGuard} from '../../core/store/order-detail/order-detail-create-from-template.resolve';
import {CreateOrderGuard} from '../../core/store/order-detail/order-detail-create.resolve';
import {GetOrderGuard} from '../../core/store/order-detail/order-detail.resolve';
import {ClearOrdersFilterGuard} from '../../core/store/orders/orders-clear.resolve';
import {RefreshOrdersFilterGuard} from '../../core/store/orders/orders-refresh.resolve';
import {OrderEditContainer} from './order-edit-container/order-edit.container';
import {OrderPageContainer} from './order-page-container/order-page.container';

const routes: Routes = [
  {
    path: 'orders',
    component: OrderPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [OrderFilterValuesLoadGuard],
    },
  },
  {
    path: 'orders/clear',
    component: OrderPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [ClearOrdersFilterGuard],
    },
  },
  {
    path: 'orders/refresh',
    component: OrderPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [RefreshOrdersFilterGuard],
    },
  },
  {
    path: 'orders/new',
    component: OrderEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [
        CreateOrderGuard,
        GetEmailActorsGuard,
      ],
    },
  },
  {
    path: 'orders/copy',
    component: OrderEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [
        OrderFilterValuesLoadGuard,
        AuthorizationGuard,
      ],
    },
  },
  {
    path: 'orders/template/new',
    component: OrderEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [
        OrderFilterValuesLoadGuard,
        CreateOrderGuard,
        AuthorizationGuard,
      ],
      authorization: 'ORDER.CREATE_TEMPLATE',
      createTemplate: true,
    },
  },
  {
    path: 'orders/template/copy',
    component: OrderEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [
        OrderFilterValuesLoadGuard,
        AuthorizationGuard,
      ],
      authorization: 'ORDER.CREATE_TEMPLATE',
      createTemplate: true,
    },
  },
  {
    path: 'orders/template/edit/:templateId',
    component: OrderEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [EditOrderTemplateGuard],
      createTemplate: true,
      type: 'ORDER',
    },
  },
  {
    path: 'orders/:etmOrderNumber',
    component: OrderEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [
        GetOrderGuard,
      ],
    },
  },
  { // Not used
    path: 'orders/:etmOrderNumber/edit',
    component: OrderEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [
        OrderFilterValuesLoadGuard,
        AuthorizationGuard,
      ],
      authorization: 'ORDER.UPDATE',
    },
  },
  {
    path: 'orders/new/fromTemplate/:templateId',
    component: OrderEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [CreateOrderFromTemplateGuard],
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdalModule,
  ],
  exports: [RouterModule],
})
export class OrdersRoutingModule {
}
