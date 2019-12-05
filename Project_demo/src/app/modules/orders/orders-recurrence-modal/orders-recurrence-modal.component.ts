import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { RecurrenceDate } from 'app/core/store/order-detail/order-detail.interface';
import { Observable } from 'rxjs/Observable';

export interface DialogData {
  dates$: Observable<RecurrenceDate[]>,
  createButtonLabel: string,
  backToCreateConfirm: () => void,
  gotoOverview: () => void,
  openOrder: (order) => void,
  createRecurrenceOrders: (dates: any[]) => void,
}

@Component({
  selector: 'app-orders-recurrence-modal',
  templateUrl: './orders-recurrence-modal.component.html',
  styleUrls: ['./orders-recurrence-modal.component.less']
})
export class OrdersRecurrenceModalComponent {
  dates: any[];
  state: 'select' | 'create' = 'select';
  isCreated: boolean = false;
  selected: number;

  createButtonLabel: string;

  constructor(private dialogRef: MdDialogRef<OrdersRecurrenceModalComponent>, @Inject(MD_DIALOG_DATA) private data: DialogData) {
    this.createButtonLabel = data.createButtonLabel;
    data.dates$.subscribe(data => {
      this.selected = 0;
      this.dates = data && data.map(date => {
        if ((date.valid || date.proposedValid) && !date.removed) {
          this.selected++;
        }
        return {
          ...date
        }
      }) || []; // Make a copy that we can edit
      if (data && data.find(date => date.saving || !!date.etmOrderNumber)) {
        this.state = 'create';
      } else {
        this.state = 'select';
      }
      this.isCreated = data && !!data.find(date => !!date.etmOrderNumber);
    })
  }
  cancel() {
    this.data.backToCreateConfirm();
  }

  create() {
    // const selectedDates = this.dates.filter(date => !date.removed && (date.proposedValid || date.valid)).map(date => date.valid ? date.requestedDate : date.proposedDate);
    this.state = 'create';
    this.data.createRecurrenceOrders(this.dates);
  }

  remove(date) {
    date.removed = true;
    this.selected--;
  }

  add(date) {
    date.removed = false;
    this.selected++;
  }

  get inCreateState(): boolean {
    return this.state === 'create';
  }

  get inSelectState(): boolean {
    return this.state === 'select';
  }

  openOrder(date): void {
    this.data.openOrder(date);
  }
  gotoOverview(): void {
    this.data.gotoOverview();
  }
}
