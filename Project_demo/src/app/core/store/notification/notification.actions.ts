import { Action } from '@ngrx/store';
import { Notification } from './notification.interface';

export const SHOW_NOTIFICATION         = 'notification:SHOW_NOTIFICATION';

export class ShowNotificationAction implements Action {
  readonly type = SHOW_NOTIFICATION;

  constructor(readonly payload: Notification) {
    // logger.stopForDebugging();
  }
}

export type Actions
  = ShowNotificationAction;
