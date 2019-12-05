import * as fromRoot from '../../../../core/store';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { MdDialog } from '@angular/material';
import { ClientUser } from '../../../../core/store/admin/users/users.interface';
import { ClientUserEditContainer } from './client-user-edit.container';
import { ClientUserInviteAction } from '../../../../core/store/admin/users/users.actions';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { AzureMonitoringService } from '../../../../core/services/AzureMonitoringService';
import { fadeInAnimation } from '../../../../animations';

@Component({
  selector: 'admin-customer-client-invite',
  templateUrl: './client-user-edit.container.html',
  styleUrls: ['./client-user-edit.container.less'],
  animations: [fadeInAnimation],
})
export class ClientUserInviteContainer extends ClientUserEditContainer implements OnInit {

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, route: ActivatedRoute, dialog: MdDialog, simplePageScrollService: SimplePageScrollService) {
    super(store, azureMonitoringService, route, dialog, simplePageScrollService);
  }

  inviteUser(epsUser: ClientUser) {
    this.store.dispatch(new ClientUserInviteAction(epsUser));
  }
}
