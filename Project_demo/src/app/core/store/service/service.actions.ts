import { Action } from '@ngrx/store';
import { ContactItem } from './service.interface';

export const CONTACT_SEND_MESSAGE = 'service:CONTACT_SEND_MESSAGE';
export const CONTACT_SEND_MESSAGE_FAIL = 'service:CONTACT_SEND_MESSAGE_FAIL';
export const CONTACT_SEND_MESSAGE_SUCCESS = 'service:CONTACT_SEND_MESSAGE_SUCCESS';

export class ContactSendMessageAction implements Action {
  readonly type = CONTACT_SEND_MESSAGE;

  constructor(readonly payload: { message: ContactItem }) {
  }
}

export class ContactSendMessageSuccessAction implements Action {
  readonly type = CONTACT_SEND_MESSAGE_SUCCESS;

  constructor() {
  }
}

export class ContactSendMessageFailAction implements Action {
  readonly type = CONTACT_SEND_MESSAGE_FAIL;

  constructor(readonly payload: any) {
  }
}

export type Actions =
  | ContactSendMessageAction
  | ContactSendMessageSuccessAction
  | ContactSendMessageFailAction
  ;
