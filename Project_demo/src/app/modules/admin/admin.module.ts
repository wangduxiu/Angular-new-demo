import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { UserEditButtonsComponent } from 'app/modules/admin/abstract-user/user-edit-buttons/user-edit-buttons.component';
import { CoreModule } from '../../core/core.module';
import { AdalModule } from '../../core/services/adal/adal.module';
import { AngularMaterialModule, SharedModule } from '../../shared';
import { ModalMessageComponent } from '../../shared/modal/modal-message.component';

import { ModalComponent } from '../../shared/modal/modal.component';
import { AdminRoutingModule } from './admin-routing.module';
import { BulkInviteCreateContainer } from './client-user/bulk-invite-create-container/bulk-invite-create.container';
import { ClientUserCreateContainer } from './client-user/client-user-edit-container/client-user-create.container';
import { ClientUserEditContainer } from './client-user/client-user-edit-container/client-user-edit.container';
import { ClientUserInviteContainer } from './client-user/client-user-edit-container/client-user-invite.container';
import { ClientUserEditComponent } from './client-user/client-user-edit/client-user-edit.component';
import { CustomerRoleListComponent } from './client-user/client-user-edit/customer-role-list.component';
import { ClientUserFilterComponent } from './client-user/client-user-filter/client-user-filter.component';
import { ClientUserListComponent } from './client-user/client-user-list/client-user-list.component';
import { ClientUserPageContainer } from './client-user/client-user-page-container/client-user-page.container';
import { EpsUserCreateContainer } from './eps-user/eps-user-edit-container/eps-user-create.container';
import { EpsUserEditContainer } from './eps-user/eps-user-edit-container/eps-user-edit.container';
import { EpsUserInviteContainer } from './eps-user/eps-user-edit-container/eps-user-invite.container';
import { EpsUserEditComponent } from './eps-user/eps-user-edit/eps-user-edit.component';
import { SalesOrganisationListComponent } from './eps-user/eps-user-edit/salesorganisation-list.component';
import { EpsUserFilterComponent } from './eps-user/eps-user-filter/eps-user-filter.component';
import { EpsUserListComponent } from './eps-user/eps-user-list/eps-user-list.component';
import { EpsUserPageContainer } from './eps-user/eps-user-page-container/eps-user-page.container';
import { I18nContainer } from './i18n/i18n-container/i18n.container';
import { I18nCsvEditor } from './i18n/i18n-csv-editor/i18n-csv-editor';
import { I18nJsonEditor } from './i18n/i18n-json-editor/i18n-json-editor';
import { I18nSelector } from './i18n/i18n-selector/i18n-selector';
import { InvitationDatesContainer } from './invitation-dates/invitation-dates-container';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule,
    AdminRoutingModule,
  ],
  declarations: [
    ClientUserPageContainer,
    ClientUserEditContainer,
    ClientUserInviteContainer,
    ClientUserCreateContainer,
    EpsUserInviteContainer,
    EpsUserCreateContainer,
    InvitationDatesContainer,
    ClientUserFilterComponent,
    ClientUserListComponent,
    ClientUserEditComponent,
    EpsUserPageContainer,
    EpsUserEditContainer,
    EpsUserFilterComponent,
    EpsUserListComponent,
    EpsUserEditComponent,
    SalesOrganisationListComponent,
    CustomerRoleListComponent,
    BulkInviteCreateContainer,
    UserEditButtonsComponent,
    I18nContainer,
    I18nJsonEditor,
    I18nCsvEditor,
    I18nSelector,
  ],
  entryComponents: [ModalComponent, ModalMessageComponent], // needed for the modal
})
export class AdminModule { }
