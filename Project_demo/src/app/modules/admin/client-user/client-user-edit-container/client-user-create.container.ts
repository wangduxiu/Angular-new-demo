import * as fromRoot from '../../../../core/store';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { MdDialog } from '@angular/material';
import { ClientUser } from '../../../../core/store/admin/users/users.interface';
import { ClientUserEditContainer } from './client-user-edit.container';
import { ClientUserCreateAction } from '../../../../core/store/admin/users/users.actions';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { AzureMonitoringService } from '../../../../core/services/AzureMonitoringService';
import { fadeInAnimation } from '../../../../animations';

@Component({
  selector: 'admin-customer-client-create',
  templateUrl: './client-user-edit.container.html',
  styleUrls: ['./client-user-edit.container.less'],
  animations: [fadeInAnimation],
})
export class ClientUserCreateContainer extends ClientUserEditContainer implements OnInit {

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, route: ActivatedRoute, dialog: MdDialog, simplePageScrollService: SimplePageScrollService) {
    super(store, azureMonitoringService, route, dialog, simplePageScrollService);
  }

  createUser(epsUser: ClientUser) {
    this.store.dispatch(new ClientUserCreateAction(epsUser));
  }
}
