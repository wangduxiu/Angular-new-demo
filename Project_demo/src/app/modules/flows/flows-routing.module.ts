import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FlowFilterValuesLoadGuard} from 'app/core/guards/flow-filter-values-load.guard';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import {AdalModule} from '../../core/services/adal/adal.module';
import {GetDefinitionsGuard} from '../../core/store/definitions/definitions.resolve';
import {CreateFlowGuard} from '../../core/store/flow-detail/flow-detail-create.resolve';
import {EditFlowGuard} from '../../core/store/flow-detail/flow-detail-edit.resolve';
import {GetFlowGuard} from '../../core/store/flow-detail/flow-detail.resolve';
import {ClearFlowsFilterGuard} from '../../core/store/flows/flows-clear.resolve';
import {FlowsOpenHandshakesFilterGuard} from '../../core/store/flows/flows-open-handshakes.resolve';
import {RefreshFlowsFilterGuard} from '../../core/store/flows/flows-refresh.resolve';
import {AuthorizationGuard} from '../../core/store/select-customer/authorization.resolve';
import {FlowEditContainer} from './flow-edit-container/flow-edit.container';
import {FlowPageContainer} from './flow-page-container/flow-page.container';
import {CustomerInfoLoadGuard} from '../../core/guards/customer-info-load.guard';

const routes: Routes = [
  {
    path: 'flows',
    component: FlowPageContainer,
    canActivate: [
      DependencyTreeGuard,
    ],
    data: {
      guards: [FlowFilterValuesLoadGuard],
    },
  },
  {
    path: 'flows/openHandshakes',
    component: FlowPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [FlowsOpenHandshakesFilterGuard],
    },
  },
  {
    path: 'flows/refresh',
    component: FlowPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [RefreshFlowsFilterGuard],
    },
  },
  {
    path: 'flows/clear',
    component: FlowPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [ClearFlowsFilterGuard],
    },
  },
  {
    path: 'flows/new',
    component: FlowEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [CreateFlowGuard],
    },
  },
  {
    path: 'flows/copy',
    component: FlowEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [
        CustomerInfoLoadGuard,
        GetDefinitionsGuard,
      ],
    },
  },
  {
    path: 'flows/:etmOrderNumber',
    component: FlowEditContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [GetFlowGuard],
    },
  },
  {
    path: 'flows/:etmOrderNumber/edit',
    component: FlowEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [EditFlowGuard],
      accept: false,
    },
  },
  {
    path: 'flows/:etmOrderNumber/accept',
    component: FlowEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [EditFlowGuard],
      accept: true,
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
export class FlowsRoutingModule {
}
