import { Action } from '@ngrx/store';

export const ADMIN_INVITATION_DATES_LOAD_CLIENT = 'ADMIN_INVITATION_DATES_LOAD_CLIENT';
export const ADMIN_INVITATION_DATES_LOAD_CLIENT_FAIL = 'ADMIN_INVITATION_DATES_LOAD_CLIENT_FAIL';
export const ADMIN_INVITATION_DATES_LOAD_CLIENT_SUCCESS = 'ADMIN_INVITATION_DATES_LOAD_CLIENT_SUCCESS ';
export const ADMIN_INVITATION_DATES_LOAD_EPS = 'ADMIN_INVITATION_DATES_LOAD_EPS';
export const ADMIN_INVITATION_DATES_LOAD_EPS_FAIL = 'ADMIN_INVITATION_DATES_LOAD_EPS_FAIL';
export const ADMIN_INVITATION_DATES_LOAD_EPS_SUCCESS = 'ADMIN_INVITATION_DATES_LOAD_EPS_SUCCESS ';

export const ADMIN_INVITATION_DATES_SAVE_CLIENT = 'ADMIN_INVITATION_DATES_SAVE_CLIENT';
export const ADMIN_INVITATION_DATES_SAVE_CLIENT_FAIL = 'ADMIN_INVITATION_DATES_SAVE_CLIENT_FAIL';
export const ADMIN_INVITATION_DATES_SAVE_CLIENT_SUCCESS = 'ADMIN_INVITATION_DATES_SAVE_CLIENT_SUCCESS ';
export const ADMIN_INVITATION_DATES_SAVE_EPS = 'ADMIN_INVITATION_DATES_SAVE_EPS';
export const ADMIN_INVITATION_DATES_SAVE_EPS_FAIL = 'ADMIN_INVITATION_DATES_SAVE_EPS_FAIL';
export const ADMIN_INVITATION_DATES_SAVE_EPS_SUCCESS = 'ADMIN_INVITATION_DATES_SAVE_EPS_SUCCESS ';

export class AdminInvitationDatesLoadClientAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_LOAD_CLIENT;
}

export class AdminInvitationDatesLoadClientSuccessAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_LOAD_CLIENT_SUCCESS;

  constructor(readonly payload: String) {
  }
}

export class AdminInvitationDatesLoadClientFailAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_LOAD_CLIENT_FAIL;

  constructor(readonly payload: any) {
  }
}

export class AdminInvitationDatesLoadEpsAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_LOAD_EPS;
}

export class AdminInvitationDatesLoadEpsSuccessAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_LOAD_EPS_SUCCESS;

  constructor(readonly payload: String) {
  }
}

export class AdminInvitationDatesLoadEpsFailAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_LOAD_EPS_FAIL;

  constructor(readonly payload: any) {
  }
}

export class AdminInvitationDatesSaveClientAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_SAVE_CLIENT;

  constructor(readonly payload: String ) {
  }
}

export class AdminInvitationDatesSaveClientSuccessAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_SAVE_CLIENT_SUCCESS;

  constructor(readonly payload: boolean) {
  }
}

export class AdminInvitationDatesSaveClientFailAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_SAVE_CLIENT_FAIL;

  constructor(readonly payload: any) {
  }
}

export class AdminInvitationDatesSaveEpsAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_SAVE_EPS;

  constructor(readonly payload: String) {
  }
}

export class AdminInvitationDatesSaveEpsSuccessAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_SAVE_EPS_SUCCESS;

  constructor(readonly payload: boolean) {
  }
}

export class AdminInvitationDatesSaveEpsFailAction implements Action {
  readonly type = ADMIN_INVITATION_DATES_SAVE_EPS_FAIL;

  constructor(readonly payload: any) {
  }
}

export type Actions
  = AdminInvitationDatesLoadClientAction
  | AdminInvitationDatesLoadClientSuccessAction
  | AdminInvitationDatesLoadClientFailAction
  | AdminInvitationDatesLoadEpsAction
  | AdminInvitationDatesLoadEpsSuccessAction
  | AdminInvitationDatesLoadEpsFailAction
  | AdminInvitationDatesSaveClientAction
  | AdminInvitationDatesSaveClientSuccessAction
  | AdminInvitationDatesSaveClientFailAction
  | AdminInvitationDatesSaveEpsAction
  | AdminInvitationDatesSaveEpsSuccessAction
  | AdminInvitationDatesSaveEpsFailAction;
