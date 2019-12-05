import { Action } from '@ngrx/store';

export const CONFIG_GET = 'cookie:CONFIG_GET';

export class GetConfigAction implements Action {
  readonly type = CONFIG_GET;
  constructor(readonly payload: any) {}
}

export type Actions
  = GetConfigAction;
