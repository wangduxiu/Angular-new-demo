import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import {AppSettings} from '../../app.settings';
import {AdalModule} from '../../core/services/adal/adal.module';
import {AuthenticationGuard} from '../../core/services/adal/authenticated.guard';
import {ClearCustomerGuard} from '../../core/store/select-customer/select-customer-clear.resolve';
import {NotSelectedCustomerGuard} from '../../core/store/select-customer/select-customer-not-selected.resolve';
import {SelectCustomerContainer} from './select-customer-container/select-customer-container';

const routes: Routes = [
  {
    path: 'customer/select/clear',
    component: SelectCustomerContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [ClearCustomerGuard],
    }
  },

  {
    path: AppSettings.SELECT_CUSTOMER_ROUTE,
    component: SelectCustomerContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [
        AuthenticationGuard,
        NotSelectedCustomerGuard
      ],
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdalModule
  ],
  exports: [RouterModule],
})
export class SelectCustomerRoutingModule {
}
