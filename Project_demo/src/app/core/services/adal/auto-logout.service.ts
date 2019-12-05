import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {from} from 'rxjs/observable/from';
import * as fromRoot from 'app/core/store/index';
import {timer} from 'rxjs/observable/timer';
import {AdalLogoutAction, AutoLogoutDismiss} from 'app/core/store/adal/adal.actions';
import {MdDialog, MdDialogConfig} from '@angular/material';
import {ModalMessageComponent} from 'app/shared/modal/modal-message.component';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/takeUntil';
import {logger} from '../../util/logger';

@Injectable()
export class AutoLogoutService {
  private enabled = true;

  constructor(
    protected store: Store<fromRoot.RootState>,
    public dialog: MdDialog,
    protected translateService: TranslateService
  ) {
  }

  private startAuthLogoutTimer() {
    const timeout = 15 * 60; // amount of time in seconds the user can be inactive
    const timeToDoAction = 30; // amount of time in seconds user can do action before logout

    // create an observable of the state so we can listen to it
    const state$ = from(this.store);

    let stopTimer = false; // Very strange behaviour: after login (adal), app is initialized twice (without sharing any (even global) scope). Only shared env is the localStorage, and this is used to stop duplicate timers.
    state$
    // We only want to start an activity timer when a user is actually logged
    // in, so filter out any state changes where session.userContext.id is not set.
      .filter((rootState: fromRoot.RootState) => rootState.session.userContext.id != null)

      // create a new observable.timer when a change is detected
      .switchMap(() => {
        try {
          localStorage.setItem('counter', '' + (timeout + 1));
        } catch (e) {
          logger.error('Issues with localStorage.setItem');
        }
        return timer(1000, 1000)
          .map(i => timeout - i)
          .take(timeout + 1);
      })

      // subscribe to the new observable.timer
      .takeWhile(() => !stopTimer && this.enabled)
      .subscribe(timer => {
        const localStorageTimer = localStorage.getItem('counter');
        if ('' + (timer + 1) !== localStorageTimer) {
          stopTimer = true;
        } else {
          localStorage.setItem('counter', '' + timer);
          // show modal when the user has X seconds left
          if (timer === timeToDoAction) {
            const modalData = {
              type: 'warning',
              title: this.translateService.instant(
                'SHARED.MODAL.HEADER_INACTIVE'
              ),
              titleCode: 'WARNING',
              message: this.translateService.instant(
                'SHARED.MODAL.MSG_INACTIVE'
              ),
              subMessages: [],
              timeToDoAction,
              redirectUrl: '/',
              buttonText: 'SHARED.BUTTONS.CLOSE'
            };
            const config: MdDialogConfig = {
              width: '50%',
              height: 'auto',
              data: modalData,
              role: 'dialog',
              disableClose: false
            };
            const dialogRef = this.dialog.open(ModalMessageComponent, config);

            dialogRef.afterClosed().subscribe(result => {
              this.store.dispatch(new AutoLogoutDismiss());
            });
          }

          // logout when X === 0
          if (timer === 0) {
            this.store.dispatch(new AdalLogoutAction());
          }
        }
      });
  }

  enable() {
    this.enabled = true;
    this.startAuthLogoutTimer();
  }

  disable() {
    this.enabled = false;
  }
}
