import { Action } from '@ngrx/store';
import { Modal } from './modal.interface';
export const SHOW_MODAL = 'modal:SHOW_MODAL';

export class ShowModalAction implements Action {
  readonly type = SHOW_MODAL;

  constructor(readonly payload: Modal) {}
}

export type Actions
  = ShowModalAction;
