import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { fadeInAnimation } from '../../../../animations';
import { AzureMonitoringService } from '../../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../../core/store';
import { AdminDefinitions } from '../../../../core/store/admin/admin-definitions/admin-definitions.interface';
import * as actions from '../../../../core/store/admin/users/users.actions';
import { ClientUser, EditUser } from '../../../../core/store/admin/users/users.interface';
import { BaseContainer } from '../../../base/BaseContainer';

@Component({
  selector: 'admin-customer-client-edit',
  templateUrl: './client-user-edit.container.html',
  styleUrls: ['./client-user-edit.container.less'],
  animations: [fadeInAnimation],
})
export class ClientUserEditContainer extends BaseContainer implements OnInit {

  readonly = false;
  editUser: EditUser;
  adminDefinitions: AdminDefinitions;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, private route: ActivatedRoute, private dialog: MdDialog, private simplePageScrollService: SimplePageScrollService) {
    super(store, azureMonitoringService);
    route.data.takeWhile(() => !this.destroyed).subscribe(data => this.readonly = !!data.readonly);
    store.select('admin').takeWhile(() => !this.destroyed).subscribe((admin: any) => {
      this.editUser = admin.edit;
      this.adminDefinitions = admin.adminDefinitions;
    });
  }

  ngOnInit(): void {
    this.simplePageScrollService.scrollToElement('#top', 0);
  }

  cancelClicked() {
    this.store.dispatch(go('/admin/clientUsers'));
  }

  updateUser(user: ClientUser) {
    this.store.dispatch(new actions.ClientUserUpdateAction(user));
  }

  salesOrganisationIdSelected(salesOrganisationId: string) {
    this.store.dispatch(new actions.ClientUserLoadSoldTosAction({ salesOrganisationId }))
  }

  soldToIdSelected(soldToId: string) {
    this.store.dispatch(new actions.ClientUserLoadShipTosAction({ soldToId }))
  }

  inviteUser(clientUser: ClientUser) {
    // Only implemented in client-user-invite.container
  }

  createUser(clientUser: ClientUser) {
    this.store.dispatch(new actions.ClientUserCreateAction(clientUser));
  }

  reInvite(userId: string) {
    this.store.dispatch(new actions.UserReInviteAction({ userId, overviewUrl: '/admin/clientUsers' }));
  }

  resetPassword(userId: string) {
    this.store.dispatch(new actions.UserResetPasswordAction({ userId, overviewUrl: '/admin/clientUsers' }));
  }
}
