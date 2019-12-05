import { Injectable } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { go } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import * as fromRoot from 'app/core/store';
import { FlorderDetail, HasRecurrenceDates } from 'app/core/store/florder-detail/florder-detail.interface';
import { DialogData, OrdersRecurrenceModalComponent } from 'app/modules/orders/orders-recurrence-modal/orders-recurrence-modal.component';

@Injectable()
export class RecurrenceService {

  private loadingDates: string[];
  private recurrenceDialog;

  constructor(
    private store: Store<fromRoot.RootState>,
    private dialog: MdDialog,
    ) {
  }

  closeRecurrenceDatesDialog() {
    if (this.recurrenceDialog) {
      this.recurrenceDialog.close();
      this.recurrenceDialog = null;
    }
  }

  openRecurrenceDatesDialog({ statePath, cb, openGoParams, backToConfirmAction, createButtonLabel, gotoOverviewUrl }: { statePath: string, cb: (loadingDates?: string[]) => void, openGoParams: (florder: FlorderDetail) => [string, any], backToConfirmAction: Action, createButtonLabel: string, gotoOverviewUrl: string }) {
    const createRecurrenceOrders = ((dates) => {
      this.loadingDates = dates;
      cb(dates);
    }).bind(this);

    const gotoOverview = (() => {
      this.store.dispatch(go([gotoOverviewUrl]));
      this.closeRecurrenceDatesDialog();
    }).bind(this);

    const openOrder = (order => {
      this.store.dispatch(go(openGoParams(order)));
      this.closeRecurrenceDatesDialog();
    }).bind(this);

    const backToCreateConfirm = (() => {
      this.store.dispatch(backToConfirmAction);
      this.loadingDates = null;
      this.closeRecurrenceDatesDialog();
    }).bind(this);

    const dates$ = this.store.select(statePath).map((hasRecurrenceDates: HasRecurrenceDates) => hasRecurrenceDates.recurrenceDates);

    const config: MdDialogConfig = {
      disableClose: true,
      width: '30%',
      height: 'auto',
      data: {
        dates$,
        createRecurrenceOrders,
        gotoOverview,
        openOrder,
        backToCreateConfirm,
        createButtonLabel,
      } as DialogData,
      role: 'dialog'
    };
    this.recurrenceDialog = this.dialog.open(OrdersRecurrenceModalComponent, config);
    this.recurrenceDialog.afterClosed().subscribe(result => {
      this.recurrenceDialog = null;
    });
  }

  isOpen() {
    return !!this.recurrenceDialog;
  }
}
