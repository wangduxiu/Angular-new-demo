import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import 'rxjs/add/operator/distinctUntilChanged';
import {AdalModule} from '../../core/services/adal/adal.module';
import {DashboardContainer} from './dashboard-container/dashboard.container';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [CustomerInfoLoadGuard],
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    AdalModule
  ],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
}
