import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import * as actions from 'app/core/store/admin/users/users.actions';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { fadeInAnimation } from '../../../../animations';
import { AzureMonitoringService } from '../../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../../core/store';
import { AdminDefinitions } from '../../../../core/store/admin/admin-definitions/admin-definitions.interface';
import { EpsUserUpdateAction, EpsUserInviteAction } from '../../../../core/store/admin/users/users.actions';
import { EditUser, EpsUser } from '../../../../core/store/admin/users/users.interface';
import { BaseContainer } from '../../../base/BaseContainer';

@Component({
  selector: 'admin-customer-eps-edit',
  templateUrl: './eps-user-edit.container.html',
  styleUrls: ['./eps-user-edit.container.less'],
  animations: [fadeInAnimation],
})
export class EpsUserEditContainer extends BaseContainer implements OnInit {

  readonly = false; // Edit can also be used as VIEW (just like clientUserEditContainer).  A bit awkward, but less code. If you want it differently, I'll adapt it
  editUser: EditUser;
  adminDefinitions: AdminDefinitions;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, private route: ActivatedRoute, private dialog: MdDialog, private simplePageScrollService: SimplePageScrollService) {
    super(store, azureMonitoringService);
    route.data.takeWhile(() => !this.destroyed).subscribe(data => this.readonly = !!data.readonly);
    store.select('admin').takeWhile(() => !this.destroyed).map((admin: any) => admin.edit).subscribe(editUser => this.editUser = editUser);
    store.select('admin').takeWhile(() => !this.destroyed).map((admin: any) => admin.adminDefinitions).subscribe((adminDefinitions) => {
      return this.adminDefinitions = adminDefinitions;
    });
  }

  ngOnInit(): void {
    this.simplePageScrollService.scrollToElement("#top", 0);
  }

  cancelClicked() {
    this.store.dispatch(go('/admin/epsUsers'));
  }
  updateUser(epsUser: EpsUser) {
    this.store.dispatch(new EpsUserUpdateAction(epsUser));
  }

  inviteUser(epsUser: EpsUser) {
    this.store.dispatch(new EpsUserInviteAction(epsUser));
  }
  createUser(epsUser: EpsUser) {
    // Only implemented in eps-user-create.container
  }

  reInvite(userId: string) {
    this.store.dispatch(new actions.UserReInviteAction({userId, overviewUrl: '/admin/epsUsers'}));
  }

  resetPassword(userId: string) {
    this.store.dispatch(new actions.UserResetPasswordAction({userId, overviewUrl: '/admin/epsUsers'}));
  }

}
