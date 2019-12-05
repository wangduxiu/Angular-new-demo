import { Action } from '@ngrx/store';
import { AdminDefinition, AdminDefinitions } from '../admin-definitions/admin-definitions.interface';
import { UsersFilter } from './users-filter.interface';
import { ClientUser, EpsUser } from './users.interface';

export const START_INVITE_CLIENT_USER = 'users:START_INVITE_CLIENT_USER';
export const START_CREATE_CLIENT_USER = 'users:START_CREATE_CLIENT_USER';
export const START_INVITE_EPS_USER = 'users:START_INVITE_EPS_USER';
export const START_CREATE_EPS_USER = 'users:START_CREATE_EPS_USER';
export const USERS_SYNC_WITH_AD = 'users:USERS_SYNC_WITH_AD';
export const USERS_SYNC_WITH_AD_SUCCESS = 'users:USERS_SYNC_WITH_AD_SUCCESS';
export const USERS_SYNC_WITH_AD_FAIL = 'users:USERS_SYNC_WITH_AD_FAIL';
export const EPS_USERS_FILTER_CLEAR = 'users:EPS_USERS_FILTER_CLEAR';
export const EPS_USER_LOAD = 'users:EPS_USER_LOAD';
export const EPS_USER_LOAD_FAIL = 'users:EPS_USER_LOAD_FAIL';
export const EPS_USER_LOAD_SUCCESS = 'users:EPS_USER_LOAD_SUCCESS';
export const EPS_USER_UPDATE = 'users:EPS_USER_UPDATE';
export const EPS_USER_UPDATE_FAIL = 'users:EPS_USER_UPDATE_FAIL';
export const EPS_USER_UPDATE_SUCCESS = 'users:EPS_USER_UPDATE_SUCCESS';
export const EPS_USERS_LOAD = 'users:EPS_USERS_LOAD';
export const EPS_USERS_LOAD_FAIL = 'users:EPS_USERS_LOAD_FAIL';
export const EPS_USERS_LOAD_SUCCESS = 'users:EPS_USERS_LOAD_SUCCESS';
export const EPS_USER_INVITE_UPDATE = 'users:EPS_USER_INVITE_UPDATE';
export const EPS_USER_INVITE_UPDATE_FAIL = 'users:EPS_USER_INVITE_UPDATE_FAIL';
export const EPS_USER_INVITE_UPDATE_SUCCESS = 'users:EPS_USER_INVITE_UPDATE_SUCCESS';
export const EPS_USER_CREATE = 'users:EPS_USER_CREATE';
export const EPS_USER_CREATE_FAIL = 'users:EPS_USER_CREATE_FAIL';
export const EPS_USER_CREATE_SUCCESS = 'users:EPS_USER_CREATE_SUCCESS';
export const CLIENT_USERS_FILTER_CLEAR = 'users:CLIENT_USERS_FILTER_CLEAR';
export const CLIENT_USER_LOAD = 'users:CLIENT_USER_LOAD';
export const CLIENT_USER_LOAD_FAIL = 'users:CLIENT_USER_LOAD_FAIL';
export const CLIENT_USER_LOAD_SUCCESS = 'users:CLIENT_USER_LOAD_SUCCESS';
export const CLIENT_USER_UPDATE = 'users:CLIENT_USER_UPDATE';
export const CLIENT_USER_UPDATE_FAIL = 'users:CLIENT_USER_UPDATE_FAIL';
export const CLIENT_USER_UPDATE_SUCCESS = 'users:CLIENT_USER_UPDATE_SUCCESS';
export const CLIENT_USER_INVITE_UPDATE = 'users:CLIENT_USER_INVITE_UPDATE';
export const CLIENT_USER_INVITE_UPDATE_FAIL = 'users:CLIENT_USER_INVITE_UPDATE_FAIL';
export const CLIENT_USER_INVITE_UPDATE_SUCCESS = 'users:CLIENT_USER_INVITE_UPDATE_SUCCESS';
export const CLIENT_USER_CREATE = 'users:CLIENT_USER_CREATE';
export const CLIENT_USER_CREATE_FAIL = 'users:CLIENT_USER_CREATE_FAIL';
export const CLIENT_USER_CREATE_SUCCESS = 'users:CLIENT_USER_CREATE_SUCCESS';
export const CLIENT_USER_LOAD_SOLDTOS = 'users:CLIENT_USER_LOAD_SOLDTOS';
export const CLIENT_USER_LOAD_SOLDTOS_FAIL = 'users:CLIENT_USER_LOAD_SOLDTOS_FAIL';
export const CLIENT_USER_LOAD_SOLDTOS_SUCCESS = 'users:CLIENT_USER_LOAD_SOLDTOS_SUCCESS';
export const CLIENT_USER_LOAD_SHIPTOS = 'users:CLIENT_USER_LOAD_SHIPTOS';
export const CLIENT_USER_LOAD_SHIPTOS_FAIL = 'users:CLIENT_USER_LOAD_SHIPTOS_FAIL';
export const CLIENT_USER_LOAD_SHIPTOS_SUCCESS = 'users:CLIENT_USER_LOAD_SHIPTOS_SUCCESS';
export const CLIENT_USERS_LOAD = 'users:CLIENT_USERS_LOAD';
export const CLIENT_USERS_LOAD_FAIL = 'users:CLIENT_USERS_LOAD_FAIL';
export const CLIENT_USERS_LOAD_SUCCESS = 'users:CLIENT_USERS_LOAD_SUCCESS';

export const CLIENT_USER_BULK_UPLOAD = 'users:CLIENT_USER_BULK_UPLOAD';
export const CLIENT_USER_BULK_UPLOAD_RESPONSE = 'users:CLIENT_USER_BULK_UPLOAD_RESPONSE';
export const CLIENT_USER_BULK_UPLOAD_FAIL = 'users:CLIENT_USER_BULK_UPLOAD_FAIL';
export const CLIENT_USER_BULK_DOWNLOAD_EXAMPLE = 'users:CLIENT_USER_BULK_DOWNLOAD_EXAMPLE';
export const CLIENT_USER_BULK_DOWNLOAD_EXAMPLE_SUCCESS = 'users:CLIENT_USER_BULK_DOWNLOAD_EXAMPLE_SUCCESS';
export const CLIENT_USER_BULK_DOWNLOAD_EXAMPLE_FAIL = 'users:CLIENT_USER_BULK_DOWNLOAD_EXAMPLE_FAIL';

export const USER_RE_INVITE = 'users:USER_RE_INVITE';
export const USER_RE_INVITE_FAIL = 'users:USER_RE_INVITE_FAIL';
export const USER_RE_INVITE_SUCCESS = 'users:USER_RE_INVITE_SUCCESS';
export const USER_RESET_PASSWORD = 'users:USER_RESET_PASSWORD';
export const USER_RESET_PASSWORD_FAIL = 'users:USER_RESET_PASSWORD_FAIL';
export const USER_RESET_PASSWORD_SUCCESS = 'users:USER_RESET_PASSWORD_SUCCESS';

export class UsersSyncWithAD implements Action {
  readonly type = USERS_SYNC_WITH_AD;

  constructor() {
  }
}

export class StartInviteClientUserAction implements Action {
  readonly type = START_INVITE_CLIENT_USER;

  constructor() {
  }
}

export class StartCreateClientUserAction implements Action {
  readonly type = START_CREATE_CLIENT_USER;

  constructor() {
  }
}

export class StartInviteEpsUserAction implements Action {
  readonly type = START_INVITE_EPS_USER;

  constructor() {
  }
}

export class StartCreateEpsUserAction implements Action {
  readonly type = START_CREATE_EPS_USER;

  constructor() {
  }
}

export class UsersSyncWithADSuccess implements Action {
  readonly type = USERS_SYNC_WITH_AD_SUCCESS;

  constructor() {
  }
}

export class UsersSyncWithADFail implements Action {
  readonly type = USERS_SYNC_WITH_AD_FAIL;

  constructor(readonly payload: string) { // Error
  }
}

export class EpsUsersFilterClearAction implements Action {
  readonly type = EPS_USERS_FILTER_CLEAR;

  constructor() {
  }
}

export class ClientUsersFilterClearAction implements Action {
  readonly type = CLIENT_USERS_FILTER_CLEAR;

  constructor() {
  }
}

export class EpsUsersLoadAction implements Action {
  readonly type = EPS_USERS_LOAD;

  constructor(readonly payload: { adminDefinitions: AdminDefinitions; filter?: UsersFilter; pageSize: number; pageNr: number; sortField: string; sortAscending: boolean }) {
  }
}

export class EpsUsersLoadSuccessAction implements Action {
  readonly type = EPS_USERS_LOAD_SUCCESS;
  readonly module = 'epsClient';

  constructor(readonly payload: { adminDefinitions: AdminDefinitions; totalItems: number; pageNr: number; pageSize: number; items: EpsUser[]; sortField: string; sortAscending: boolean }) {
  }
}

export class EpsUsersLoadFailAction implements Action {
  readonly type = EPS_USERS_LOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class ClientUsersLoadAction implements Action {
  readonly type = CLIENT_USERS_LOAD;

  constructor(readonly payload: { adminDefinitions: AdminDefinitions; filter?: UsersFilter; pageSize: number; pageNr: number; sortField: string; sortAscending: boolean }) {
  }
}

export class ClientUsersLoadSuccessAction implements Action {
  readonly type = CLIENT_USERS_LOAD_SUCCESS;
  readonly module = 'customerClient';

  constructor(readonly payload: { adminDefinitions: AdminDefinitions; totalItems: number; pageNr: number; pageSize: number; items: ClientUser[]; sortField: string; sortAscending: boolean }) {
  }
}

export class ClientUsersLoadFailAction implements Action {
  readonly type = CLIENT_USERS_LOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class ClientUserLoadSoldTosAction implements Action {
  readonly type = CLIENT_USER_LOAD_SOLDTOS;

  constructor(readonly payload: { salesOrganisationId: string }) {
  }
}

export class ClientUserLoadSoldTosSuccessAction implements Action {
  readonly type = CLIENT_USER_LOAD_SOLDTOS_SUCCESS;

  constructor(readonly payload: { soldTos: AdminDefinition[] }) {
  }
}

export class ClientUserLoadSoldTosFailAction implements Action {
  readonly type = CLIENT_USER_LOAD_SOLDTOS_FAIL;

  constructor(readonly payload: any) {
  }
}

export class ClientUserLoadShipTosAction implements Action {
  readonly type = CLIENT_USER_LOAD_SHIPTOS;

  constructor(readonly payload: { soldToId: string }) {
  }
}

export class ClientUserLoadShipTosSuccessAction implements Action {
  readonly type = CLIENT_USER_LOAD_SHIPTOS_SUCCESS;

  constructor(readonly payload: { shipTos: AdminDefinition[] }) {
  }
}

export class ClientUserLoadShipTosFailAction implements Action {
  readonly type = CLIENT_USER_LOAD_SHIPTOS_FAIL;

  constructor(readonly payload: any) {
  }
}

export class EpsUserLoadAction implements Action {
  readonly type = EPS_USER_LOAD;

  constructor(readonly payload: string) {
  } // id
}

export class EpsUserLoadSuccessAction implements Action {
  readonly type = EPS_USER_LOAD_SUCCESS;
  readonly module = 'epsClient';

  constructor(readonly payload: EpsUser) {
  }
}

export class EpsUserLoadFailAction implements Action {
  readonly type = EPS_USER_LOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class ClientUserLoadAction implements Action {
  readonly type = CLIENT_USER_LOAD;

  constructor(readonly payload: string) {
  } // id
}

export class ClientUserLoadSuccessAction implements Action {
  readonly type = CLIENT_USER_LOAD_SUCCESS;
  readonly module = 'customerClient';

  constructor(readonly payload: ClientUser) {
  }
}

export class ClientUserLoadFailAction implements Action {
  readonly type = CLIENT_USER_LOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class EpsUserUpdateAction implements Action {
  readonly type = EPS_USER_UPDATE;

  constructor(readonly payload: EpsUser) {
  }
}

export class EpsUserUpdateSuccessAction implements Action {
  readonly type = EPS_USER_UPDATE_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class EpsUserUpdateFailAction implements Action {
  readonly type = EPS_USER_UPDATE_FAIL;

  constructor(readonly payload: any) {
  }
}

export class EpsUserInviteAction implements Action {
  readonly type = EPS_USER_INVITE_UPDATE;

  constructor(readonly payload: EpsUser) {
  }
}

export class EpsUserInviteSuccessAction implements Action {
  readonly type = EPS_USER_INVITE_UPDATE_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class EpsUserInviteFailAction implements Action {
  readonly type = EPS_USER_INVITE_UPDATE_FAIL;

  constructor(readonly payload: any) {
  }
}

export class EpsUserCreateAction implements Action {
  readonly type = EPS_USER_CREATE;

  constructor(readonly payload: EpsUser) {
  }
}

export class EpsUserCreateSuccessAction implements Action {
  readonly type = EPS_USER_CREATE_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class EpsUserCreateFailAction implements Action {
  readonly type = EPS_USER_CREATE_FAIL;

  constructor(readonly payload: any) {
  }
}


export class ClientUserUpdateAction implements Action {
  readonly type = CLIENT_USER_UPDATE;

  constructor(readonly payload: ClientUser) {
  }
}

export class ClientUserUpdateSuccessAction implements Action {
  readonly type = CLIENT_USER_UPDATE_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class ClientUserUpdateFailAction implements Action {
  readonly type = CLIENT_USER_UPDATE_FAIL;

  constructor(readonly payload: any) {
  }
}

export class ClientUserInviteAction implements Action {
  readonly type = CLIENT_USER_INVITE_UPDATE;

  constructor(readonly payload: ClientUser) {
  }
}

export class ClientUserInviteSuccessAction implements Action {
  readonly type = CLIENT_USER_INVITE_UPDATE_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class ClientUserInviteFailAction implements Action {
  readonly type = CLIENT_USER_INVITE_UPDATE_FAIL;

  constructor(readonly payload: any) {
  }
}

export class ClientUserCreateAction implements Action {
  readonly type = CLIENT_USER_CREATE;

  constructor(readonly payload: ClientUser) {
  }
}

export class ClientUserCreateSuccessAction implements Action {
  readonly type = CLIENT_USER_CREATE_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class ClientUserCreateFailAction implements Action {
  readonly type = CLIENT_USER_CREATE_FAIL;

  constructor(readonly payload: any) {
  }
}

export class ClientUserBulkUploadAction implements Action {
  readonly type = CLIENT_USER_BULK_UPLOAD;

  constructor(readonly payload: FormData) {
  }
}

export class ClientUserBulkUploadResponseAction implements Action {
  readonly type = CLIENT_USER_BULK_UPLOAD_RESPONSE;

  constructor(readonly payload: { blob: Blob, filename: string }) {
  }
}

export class ClientUserBulkUploadFailAction implements Action {
  readonly type = CLIENT_USER_BULK_UPLOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class ClientUserBulkDownloadExampleAction implements Action {
  readonly type = CLIENT_USER_BULK_DOWNLOAD_EXAMPLE;

}

export class ClientUserBulkDownloadExampleSuccessAction implements Action {
  readonly type = CLIENT_USER_BULK_DOWNLOAD_EXAMPLE_SUCCESS;

  constructor(readonly payload: { blob: Blob, filename: string }) {
  }
}

export class ClientUserBulkDownloadExampleFailAction implements Action {
  readonly type = CLIENT_USER_BULK_DOWNLOAD_EXAMPLE_FAIL;

  constructor(readonly payload: any) {
  }
}


export class UserReInviteAction implements Action {
  readonly type = USER_RE_INVITE;

  constructor(readonly payload: {userId: string, overviewUrl: string}){}
}

export class UserReInviteSuccessAction implements Action {
  readonly type = USER_RE_INVITE_SUCCESS;
}

export class UserReInviteFailAction implements Action {
  readonly type = USER_RE_INVITE_FAIL;

  constructor(readonly payload: any) {
  }
}

export class UserResetPasswordAction implements Action {
  readonly type = USER_RESET_PASSWORD;

  constructor(readonly payload: {userId: string, overviewUrl: string}){}
}

export class UserResetPasswordSuccessAction implements Action {
  readonly type = USER_RESET_PASSWORD_SUCCESS;
}

export class UserResetPasswordFailAction implements Action {
  readonly type = USER_RESET_PASSWORD_FAIL;

  constructor(readonly payload: any) {
  }
}




export type Actions =
  UsersSyncWithAD
  | StartInviteClientUserAction
  | StartCreateClientUserAction
  | StartInviteEpsUserAction
  | StartCreateEpsUserAction
  | UsersSyncWithADSuccess
  | UsersSyncWithADFail
  | EpsUsersFilterClearAction
  | EpsUserLoadAction
  | EpsUserLoadSuccessAction
  | EpsUserLoadFailAction
  | EpsUserUpdateAction
  | EpsUserUpdateSuccessAction
  | EpsUserUpdateFailAction
  | EpsUsersLoadAction
  | EpsUsersLoadSuccessAction
  | EpsUsersLoadFailAction
  | EpsUserInviteAction
  | EpsUserInviteSuccessAction
  | EpsUserInviteFailAction
  | EpsUserCreateAction
  | EpsUserCreateSuccessAction
  | EpsUserCreateFailAction
  | ClientUsersFilterClearAction
  | ClientUserLoadAction
  | ClientUserLoadSuccessAction
  | ClientUserLoadFailAction
  | ClientUserUpdateAction
  | ClientUserUpdateSuccessAction
  | ClientUserUpdateFailAction
  | ClientUserInviteAction
  | ClientUserInviteSuccessAction
  | ClientUserInviteFailAction
  | ClientUserCreateAction
  | ClientUserCreateSuccessAction
  | ClientUserCreateFailAction
  | ClientUserBulkUploadAction
  | ClientUserBulkUploadResponseAction
  | ClientUserBulkUploadFailAction
  | ClientUserBulkDownloadExampleAction
  | ClientUserBulkDownloadExampleSuccessAction
  | ClientUserBulkDownloadExampleFailAction
  | ClientUsersLoadAction
  | ClientUsersLoadSuccessAction
  | ClientUsersLoadFailAction
  | ClientUserLoadSoldTosAction
  | ClientUserLoadSoldTosSuccessAction
  | ClientUserLoadSoldTosFailAction
  | ClientUserLoadShipTosAction
  | ClientUserLoadShipTosSuccessAction
  | ClientUserLoadShipTosFailAction
  | UserReInviteAction
  | UserReInviteSuccessAction
  | UserReInviteFailAction
  | UserResetPasswordAction
  | UserResetPasswordSuccessAction
  | UserResetPasswordFailAction
  ;
