import { Action } from '@ngrx/store';
import { EmailActorsItem } from './email-actors.interface';

export const EMAIL_ACTORS_LOAD = 'email-actors:EMAIL_ACTORS_LOAD';
export const EMAIL_ACTORS_LOAD_FAIL = 'email-actors:EMAIL_ACTORS_LOAD_FAIL';
export const EMAIL_ACTORS_LOAD_SUCCESS = 'email-actors:EMAIL_ACTORS_LOAD_SUCCESS';

export const EMAIL_ACTORS_CREATE_OR_UPDATE = 'email-actors:EMAIL_ACTORS_CREATE_OR_UPDATE';
export const EMAIL_ACTORS_CREATE_OR_UPDATE_FAIL = 'email-actors:EMAIL_ACTORS_CREATE_OR_UPDATE_FAIL';
export const EMAIL_ACTORS_CREATE_OR_UPDATE_SUCCESS = 'email-actors:EMAIL_ACTORS_CREATE_OR_UPDATE_SUCCESS';

export const EMAIL_ACTORS_DELETE = 'email-actors:EMAIL_ACTORS_DELETE';
export const EMAIL_ACTORS_DELETE_FAIL = 'email-actors:EMAIL_ACTORS_DELETE_FAIL';
export const EMAIL_ACTORS_DELETE_SUCCESS = 'email-actors:EMAIL_ACTORS_DELETE_SUCCESS';

export class EmailActorsLoadAction implements Action {
  readonly type = EMAIL_ACTORS_LOAD;

  constructor(readonly payload?: string) {
  }
}

export class EmailActorsLoadSuccessAction implements Action {
  readonly type = EMAIL_ACTORS_LOAD_SUCCESS;

  constructor(readonly payload: EmailActorsItem[]) {
  }
}

export class EmailActorsLoadFailAction implements Action {
  readonly type = EMAIL_ACTORS_LOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class EmailActorsCreateOrUpdateAction implements Action {
  readonly type = EMAIL_ACTORS_CREATE_OR_UPDATE;

  constructor(readonly payload: { emailActor: EmailActorsItem }) {
  }
}

export class EmailActorsCreateOrUpdateSuccessAction implements Action {
  readonly type = EMAIL_ACTORS_CREATE_OR_UPDATE_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class EmailActorsCreateOrUpdateFailAction implements Action {
  readonly type = EMAIL_ACTORS_CREATE_OR_UPDATE_FAIL;

  constructor(readonly payload: any) {
  }
}

export class EmailActorsDeleteAction implements Action {
  readonly type = EMAIL_ACTORS_DELETE;

  constructor(readonly payload: { id: number }) {
  }
}

export class EmailActorsDeleteSuccessAction implements Action {
  readonly type = EMAIL_ACTORS_DELETE_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class EmailActorsDeleteFailAction implements Action {
  readonly type = EMAIL_ACTORS_DELETE_FAIL;

  constructor(readonly payload: any) {
  }
}

export type Actions =
  | EmailActorsLoadAction
  | EmailActorsLoadSuccessAction
  | EmailActorsLoadFailAction
  | EmailActorsCreateOrUpdateAction
  | EmailActorsCreateOrUpdateSuccessAction
  | EmailActorsCreateOrUpdateFailAction
  | EmailActorsDeleteAction
  | EmailActorsDeleteSuccessAction
  | EmailActorsDeleteFailAction
  ;
