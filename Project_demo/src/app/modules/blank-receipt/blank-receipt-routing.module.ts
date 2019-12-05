import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import 'rxjs/add/operator/distinctUntilChanged';
import {AdalModule} from '../../core/services/adal/adal.module';
import {GetDefinitionsGuard} from '../../core/store/definitions/definitions.resolve';

import {BlankReceiptPageContainer} from './blank-receipt-page-container/blank-receipt-page.container';

const routes: Routes = [
  {
    path: 'blank-receipts',
    component: BlankReceiptPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [GetDefinitionsGuard],
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
export class BlankReceiptRoutingModule {
}
