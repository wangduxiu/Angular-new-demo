import { Injectable } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { Actions, Effect } from '@ngrx/effects';
import { go } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { RootState } from '../';
import { ModalMessageComponent } from '../../../shared/modal/modal-message.component';
import * as actions from './modal.actions';

@Injectable()
export class ModalEffects {

  private openDialogs: number = 0;

  constructor(private store: Store<RootState>, private actions$: Actions, private translateService: TranslateService, public dialog: MdDialog) {
  }

  @Effect({ dispatch: false })
  showModal$: Observable<Action>
    = this.actions$
          .ofType(actions.SHOW_MODAL)
          .switchMap(action => {
            if (this.openDialogs === 0) {
              this.openDialogs += 1;
              const modalData = action.payload;
              const config: MdDialogConfig = {
                width: '50%', height: 'auto', data: modalData, role: 'dialog', disableClose: action.payload.disableClose
              };
              const dialogRef = this.dialog.open(ModalMessageComponent, config);
              dialogRef.afterClosed().subscribe(result => {
                this.openDialogs -= 1;
                if (modalData.redirectUrl) {
                    // redirect to given redirectUrl
                  this.store.dispatch(go(`${modalData.redirectUrl}`));
                }
              });

            }
              return Observable.of(null);
            }
          );
}
