import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less'],
})
export class ModalComponent {
  constructor(
    private dialogRef: MdDialogRef<ModalComponent>,
    @Inject(MD_DIALOG_DATA) public data: any,
  ) {}

  gotoDetailAndClose() {
    !this.data.disableClose && this.dialogRef.close({goToDetail: true});
  }
  gotoOverviewAndClose() {
    !this.data.disableClose && this.dialogRef.close({goToOverview: true});
  }
  downloadAndClose() {
    !this.data.disableClose && this.dialogRef.close({ downloadDocument: true, goToDetail: true});
  }
  createAndClose() {
    !this.data.disableClose && this.dialogRef.close({ goToCreate: true });
  }
}
