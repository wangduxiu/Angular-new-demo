import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { util } from '../../../core/util/util';

@Component({
  selector: 'app-calendar-create-relocation-modal',
  templateUrl: './calendar-create-relocation-modal.component.html',
  styleUrls: ['./calendar-create-relocation-modal.component.less']
})
export class CalendarCreateRelocationModalComponent {
  constructor(private dialogRef: MdDialogRef<CalendarCreateRelocationModalComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
  }

  close(createOrder: boolean, id?: string, salesOrderNumber?: string) {
    const date = util.formatDate(this.data.day.date.toDate());
    this.dialogRef.close({ createOrder, id, salesOrderNumber, date });
  }
}
