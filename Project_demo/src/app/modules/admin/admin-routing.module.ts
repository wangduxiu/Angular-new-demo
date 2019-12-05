import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DependencyTreeGuard } from 'app/core/guards/dependency-tree.guard';
import 'rxjs/add/operator/distinctUntilChanged';
import { AdalModule } from '../../core/services/adal/adal.module';
import { GetAdminDefinitionsGuard } from '../../core/store/admin/admin-definitions/admin-definitions.resolve';
import { ResetI18nGuard } from '../../core/store/admin/i18n/i18n.resolve';
import { GetInvitationDatesGuard } from '../../core/store/admin/invitation-dates/invitation-dates.resolve';
import { CreateClientUserGuard, GetClientUserGuard } from '../../core/store/admin/users/client-user.resolve';
import { GetEpsUserGuard, InviteEpsUserGuard } from '../../core/store/admin/users/eps-user.resolve';
import { AuthorizationGuard } from '../../core/store/select-customer/authorization.resolve';
import { BulkInviteCreateContainer } from './client-user/bulk-invite-create-container/bulk-invite-create.container';
import { ClientUserCreateContainer } from './client-user/client-user-edit-container/client-user-create.container';
import { ClientUserEditContainer } from './client-user/client-user-edit-container/client-user-edit.container';
import { ClientUserInviteContainer } from './client-user/client-user-edit-container/client-user-invite.container';
import { ClientUserPageContainer } from './client-user/client-user-page-container/client-user-page.container';
import { EpsUserEditContainer } from './eps-user/eps-user-edit-container/eps-user-edit.container';
import { EpsUserInviteContainer } from './eps-user/eps-user-edit-container/eps-user-invite.container';
import { EpsUserPageContainer } from './eps-user/eps-user-page-container/eps-user-page.container';
import { I18nContainer } from './i18n/i18n-container/i18n.container';
import { InvitationDatesContainer } from './invitation-dates/invitation-dates-container';

const routes: Routes = [
  {
    path: 'admin/clientUsers',
    component: ClientUserPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [GetAdminDefinitionsGuard],
    }
  },
  {
    path: 'admin/epsUsers',
    component: EpsUserPageContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        AuthorizationGuard,
        GetAdminDefinitionsGuard
      ],
      authorization: 'isAdmin'
    }
  },
  {
    path: 'admin/epsUsers/:id',
    component: EpsUserEditContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        GetEpsUserGuard,
      ],
      readonly: true
    }
  },
  {
    path: 'admin/epsUsers/:id/edit',
    component: EpsUserEditContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        GetEpsUserGuard,
      ],
    }
  },
  {
    path: 'admin/epsUsers/invite',
    component: EpsUserInviteContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        InviteEpsUserGuard
      ],
    }
  }, // { path: 'admin/epsUsers/create', component: EpsUserCreateContainer, canActivate: [AuthorizationGuard, CreateEpsUserGuard, GetAdminDefinitionsGuard], data:{authorization:'isAdmin'} },
  {
    path: 'admin/clientUsers/:id',
    component: ClientUserEditContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        GetClientUserGuard
      ],
      readonly: true
    }
  },
  {
    path: 'admin/clientUsers/:id/edit',
    component: ClientUserEditContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        GetClientUserGuard,
        AuthorizationGuard
      ],
      authorization: 'updateClientUser'
    }
  },
  {
    path: 'admin/clientUsers/invite',
    component: ClientUserInviteContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        AuthorizationGuard
      ],
      authorization: 'inviteClientUser'
    }
  },
  {
    path: 'admin/clientUsers/create',
    component: ClientUserCreateContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        CreateClientUserGuard,
        GetAdminDefinitionsGuard
      ],
    }
  },
  {
    path: 'admin/clientUsers/bulkInviteCreate',
    component: BulkInviteCreateContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        AuthorizationGuard,
        GetAdminDefinitionsGuard
      ],
      authorization: 'isAgent'
    }
  },
  {
    path: 'admin/i18n',
    component: I18nContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        AuthorizationGuard,
        GetAdminDefinitionsGuard
      ],
      authorization: 'isAdmin'
    }
  },
  {
    path: 'admin/i18n/reset',
    component: I18nContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        GetAdminDefinitionsGuard,
        ResetI18nGuard
      ],
      reset: 'all'
    }
  },
  {
    path: 'admin/i18n/resetMissing',
    component: I18nContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        GetAdminDefinitionsGuard,
        ResetI18nGuard
      ],
      reset: 'missing'
    }
  },
  {
    path: 'admin/dates',
    component: InvitationDatesContainer,
    canActivate: [
      DependencyTreeGuard
    ],
    data: {
      guards: [
        GetInvitationDatesGuard
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
export class AdminRoutingModule {
}
