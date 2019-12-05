import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import {AdalModule} from 'app/core/services/adal/adal.module';
import {DescartesInvoicesPageContainer} from 'app/modules/descartes-invoices/descartes-invoices-page-container/descartes-invoices-page-container.component';
import {GetDescartesInvoicesUrlGuard} from '../../core/store/invoice/descartes-invoices.resolve';

const routes: Routes = [
  {
    path: 'descartes-invoices',
    component: DescartesInvoicesPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [GetDescartesInvoicesUrlGuard],
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
export class DescartesInvoicesRoutingModule {
}
