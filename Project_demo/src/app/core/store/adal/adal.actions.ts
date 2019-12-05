import { Action } from '@ngrx/store';

export const ADAL_LOGOUT = 'adal:LOGOUT';
export const ADAL_LOGIN = 'adal:LOGIN';
export const ADAL_LOGIN_FAILURE = 'adal:LOGIN_FAILURE';
export const ADAL_LOGIN_SUCCESS = 'adal:LOGIN_SUCCESS';
export const AUTO_LOGOUT_DISMISS = 'adal:AUTO_LOGOUT_DISMISS';

export class AdalLogoutAction implements Action {
  readonly type = ADAL_LOGOUT;
  constructor() {}
}

export class AdalLoginAction implements Action {
  readonly type = ADAL_LOGIN;
  constructor() {}
}

export class AdalLoginFailureAction implements Action {
  readonly type = ADAL_LOGIN_FAILURE;
  constructor() {}
}

export class AdalLoginSuccessAction implements Action {
  readonly type = ADAL_LOGIN_SUCCESS;

  constructor(readonly payload: { username: string }) {}
}

export class AutoLogoutDismiss implements Action {
  readonly type = AUTO_LOGOUT_DISMISS;

  constructor() {}
}

export type Actions =
  | AdalLogoutAction
  | AdalLoginAction
  | AdalLoginFailureAction
  | AdalLoginSuccessAction
  | AutoLogoutDismiss;
