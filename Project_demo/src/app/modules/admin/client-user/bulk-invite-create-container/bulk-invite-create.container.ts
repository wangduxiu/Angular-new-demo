import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { BaseContainer } from '../../../base/BaseContainer';
import { AzureMonitoringService } from '../../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../../core/store';
import { fadeInAnimation } from '../../../../animations';
import * as actions from '../../../../core/store/admin/users/users.actions';
import { ClientUsers } from '../../../../core/store/admin/users/users.interface';

@Component({
  selector: 'admin-bulk-invite-create',
  templateUrl: './bulk-invite-create.container.html',
  styleUrls: ['./bulk-invite-create.container.less'],
  animations: [fadeInAnimation],
})
export class BulkInviteCreateContainer extends BaseContainer implements OnInit {

  @ViewChild('fileInput') fileInput;
  downloadExampleInProgress: boolean = false;
  uploadInProgress: boolean = false;
  inProgress: boolean = false;
  finished: boolean = false;
  selectedFile: any;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, private route: ActivatedRoute, private dialog: MdDialog, private simplePageScrollService: SimplePageScrollService) {
    super(store, azureMonitoringService);
    store
      .select('admin')
      .takeWhile(() => !this.destroyed)
      .map((admin: {clientUsers: ClientUsers}) => admin && admin.clientUsers.bulk)
      .subscribe(bulk => {
        this.inProgress = bulk.inProgress;
        if (!bulk.inProgress) {
          this.downloadExampleInProgress = false;
          this.uploadInProgress = false;
        }
        this.finished = bulk.finished;
      });
  }

  ngOnInit(): void {
  }

  getExample(): void {
    this.downloadExampleInProgress = true;
    this.store.dispatch(new actions.ClientUserBulkDownloadExampleAction());
  }

  fileSelectedChange(): void {
    const fileBrowser = this.fileInput.nativeElement;
    this.selectedFile = fileBrowser.files && fileBrowser.files[0];
  }

  doUpload(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append("image", this.selectedFile);
      this.uploadInProgress = true;
      this.store.dispatch(new actions.ClientUserBulkUploadAction(formData));
    }

  }
}
