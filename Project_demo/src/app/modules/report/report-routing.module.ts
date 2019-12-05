import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import 'rxjs/add/operator/distinctUntilChanged';
import {AdalModule} from '../../core/services/adal/adal.module';
import {GetPowerBIUrlGuard} from '../../core/store/stock/power-bi.resolve';
import {ReportPageContainer} from './report-page-container/report-page.container';

const routes: Routes = [
  {
    path: 'report',
    component: ReportPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [GetPowerBIUrlGuard],
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
export class ReportRoutingModule {
}
