import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import 'rxjs/add/operator/distinctUntilChanged';
import {AdalModule} from '../../core/services/adal/adal.module';
import {GetCCRGuard} from '../../core/store/ccr-detail/ccr-detail.resolve';
import {CCREditContainer} from './ccr-edit-container/ccr-edit.container';

const routes: Routes = [
  {
    path: 'ccr/:etmOrderNumber',
    component: CCREditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [GetCCRGuard],
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), AdalModule],
  exports: [RouterModule],
})
export class CCRRoutingModule {
}
