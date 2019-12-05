import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import {CreateRelocationFromTemplateGuard} from 'app/core/store/relocation-detail/relocation-detail-create-from-template.resolve';
import {EditRelocationTemplateGuard} from 'app/core/store/template/relocation-template-edit.resolve';
import 'rxjs/add/operator/distinctUntilChanged';
import {AdalModule} from '../../core/services/adal/adal.module';
import {GetDefinitionsGuard} from '../../core/store/definitions/definitions.resolve';
import {CreateRelocationGuard} from '../../core/store/relocation-detail/relocation-detail-create.resolve';
import {GetRelocationGuard} from '../../core/store/relocation-detail/relocation-detail.resolve';
import {RefreshRelocationsFilterGuard} from '../../core/store/relocations/relocations-refresh.resolve';
import {AuthorizationGuard} from '../../core/store/select-customer/authorization.resolve';
import {RelocationEditContainer} from './relocation-edit-container/relocation-edit.container';
import {RelocationPageContainer} from './relocation-page-container/relocation-page.container';

const routes: Routes = [
  {
    path: 'relocations',
    component: RelocationPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [
        AuthorizationGuard,
        GetDefinitionsGuard
      ],
      authorization: 'canRelocate'
    }
  },

  {
    path: 'relocations/refresh',
    component: RelocationPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [RefreshRelocationsFilterGuard],
    }
  },

  {
    path: 'relocations/new',
    component: RelocationEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [CreateRelocationGuard],
      preventCheckingContractDetails: true
    }
  },

  {
    path: 'relocations/copy',
    component: RelocationEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [
        AuthorizationGuard,
        GetDefinitionsGuard
      ],
      authorization: 'canRelocate'
    },
  },

  {
    path: 'relocations/:etmOrderNumber',
    component: RelocationEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [GetRelocationGuard],
    }
  },

  {
    path: 'relocations/template/new',
    component: RelocationEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [CreateRelocationGuard],
      createTemplate: true
    },
  },

  {
    path: 'relocations/template/edit/:templateId',
    component: RelocationEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [EditRelocationTemplateGuard],
      createTemplate: true,
      type: 'RELOCATION'
    },
  },

  {
    path: 'relocations/template/copy',
    component: RelocationEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [
        AuthorizationGuard,
        GetDefinitionsGuard
      ],
      createTemplate: true
    }
  },

  {
    path: 'relocations/new/fromTemplate/:templateId',
    component: RelocationEditContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [CreateRelocationFromTemplateGuard],
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
export class RelocationRoutingModule {
}
