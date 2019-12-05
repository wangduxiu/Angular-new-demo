import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import {AdalModule} from 'app/core/services/adal/adal.module';
import {InvoicesPageContainer} from 'app/modules/invoices/invoices-page-container/invoices-page-container.component';
import {GetDefinitionsGuard} from '../../core/store/definitions/definitions.resolve';
import {AuthorizationGuard} from '../../core/store/select-customer/authorization.resolve';
import {CustomerInfoLoadGuard} from '../../core/guards/customer-info-load.guard';

const routes: Routes = [
  {
    path: 'invoices',
    component: InvoicesPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [AuthorizationGuard, GetDefinitionsGuard, CustomerInfoLoadGuard],
      authorization: 'INVOICES.ACCESS'
    }
  },
  {
    path: 'invoices/clear',
    component: InvoicesPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [AuthorizationGuard, GetDefinitionsGuard, CustomerInfoLoadGuard],
      authorization: 'INVOICES.ACCESS'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), AdalModule],
  exports: [RouterModule],
})
export class InvoicesRoutingModule {
}
