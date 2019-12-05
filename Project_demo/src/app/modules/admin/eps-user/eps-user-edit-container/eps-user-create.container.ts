import { Component, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { fadeInAnimation } from '../../../../animations';
import { AzureMonitoringService } from '../../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../../core/store';
import { EpsUserCreateAction } from '../../../../core/store/admin/users/users.actions';
import { EpsUser } from '../../../../core/store/admin/users/users.interface';
import { EpsUserEditContainer } from './eps-user-edit.container';

@Component({
  selector: 'admin-customer-eps-create',
  templateUrl: './eps-user-edit.container.html',
  styleUrls: ['./eps-user-edit.container.less'],
  animations: [fadeInAnimation],
})
export class EpsUserCreateContainer extends EpsUserEditContainer implements OnInit {

  readonly = false;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, route: ActivatedRoute, dialog: MdDialog, simplePageScrollService: SimplePageScrollService) {
    super(store, azureMonitoringService, route, dialog, simplePageScrollService);
  }

  createUser(epsUser: EpsUser) {
    this.store.dispatch(new EpsUserCreateAction(epsUser));
  }

}
