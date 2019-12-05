import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { AdalLogoutAction } from '../../core/store/adal/adal.actions';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-modal-message',
  templateUrl: './modal-message.component.html',
  styleUrls: ['./modal-message.component.less'],
})
export class ModalMessageComponent {
  timeToDoAction$: Observable<number>;

  params: any;

  constructor(private dialogRef: MdDialogRef<ModalMessageComponent>, @Inject(MD_DIALOG_DATA) public data: any, @Inject(Store) private store) {
    this.params = this.data.params || {};
    if (this.data.timeToDoAction) {
      this.timeToDoAction$ = timer(0, 1000)
        .map(i => this.data.timeToDoAction - i)
        .take(this.data.timeToDoAction);
    }
  }

  close() {
    !this.data.disableClose && this.dialogRef.close({});
  }

  logout() {
    this.store.dispatch(new AdalLogoutAction());
    !this.data.disableClose && this.dialogRef.close({});
  }
}
