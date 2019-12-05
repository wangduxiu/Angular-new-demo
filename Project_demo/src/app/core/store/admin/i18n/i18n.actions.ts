import { Action } from '@ngrx/store';

export const LANGUAGE_LOAD         = 'i18n:LANGUAGE_LOAD';
export const LANGUAGE_LOAD_FAIL    = 'i18n:LANGUAGE_LOAD_FAIL';
export const LANGUAGE_LOAD_SUCCESS = 'i18n:LANGUAGE_LOAD_SUCCESS';
export const LANGUAGE_SAVE         = 'i18n:LANGUAGE_SAVE';
export const LANGUAGE_SAVE_FAIL    = 'i18n:LANGUAGE_SAVE_FAIL';
export const LANGUAGE_SAVE_SUCCESS = 'i18n:LANGUAGE_SAVE_SUCCESS';
export const LANGUAGE_RESET_SERVER  = 'i18n:LANGUAGE_RESET_SERVER';
export const LANGUAGE_SET_MISSING_SERVER  = 'i18n:LANGUAGE_SET_MISSING_SERVER';
export const LANGUAGE_SET_REFERENCE_LANGUAGE  = 'i18n:LANGUAGE_SET_REFERENCE_LANGUAGE';
export const LANGUAGE_SET_REFERENCE_LANGUAGE_SUCCESS  = 'i18n:LANGUAGE_SET_REFERENCE_LANGUAGE_SUCCESS';
export const LANGUAGE_LOAD_ALL         = 'i18n:LANGUAGE_LOAD_ALL';
export const LANGUAGE_LOAD_ALL_FAIL    = 'i18n:LANGUAGE_LOAD_ALL_FAIL';
export const LANGUAGE_LOAD_ALL_SUCCESS = 'i18n:LANGUAGE_LOAD_ALL_SUCCESS';
export const LANGUAGE_SAVE_ALL         = 'i18n:LANGUAGE_SAVE_ALL';
export const LANGUAGE_SAVE_ALL_FAIL    = 'i18n:LANGUAGE_SAVE_ALL_FAIL';
export const LANGUAGE_SAVE_ALL_SUCCESS = 'i18n:LANGUAGE_SAVE_ALL_SUCCESS';

export class LanguageResetServerAction implements Action {
  readonly type = LANGUAGE_RESET_SERVER;
  mode = 'all';
}

export class LanguageSetMissingServerAction implements Action {
  readonly type = LANGUAGE_SET_MISSING_SERVER;
  mode = 'missing';
}

export class LanguageSetReferenceLanguageAction implements Action {
  readonly type = LANGUAGE_SET_REFERENCE_LANGUAGE;
}

export class LanguageSetReferenceLanguageSuccessAction implements Action {
  readonly type = LANGUAGE_SET_REFERENCE_LANGUAGE_SUCCESS;

  constructor(readonly payload:{json:any}) {}
}

export class LanguageLoadAction implements Action {
  readonly type = LANGUAGE_LOAD;

  constructor(readonly payload:{language:string}) {}
}

export class LanguageLoadSuccessAction implements Action {
  readonly type = LANGUAGE_LOAD_SUCCESS;

  constructor(readonly payload: string) {}
}

export class LanguageLoadFailAction implements Action {
  readonly type = LANGUAGE_LOAD_FAIL;

  constructor(readonly payload: any) {}
}

export class LanguageLoadAllAction implements Action {
  readonly type = LANGUAGE_LOAD_ALL;
}

export class LanguageLoadAllSuccessAction implements Action {
  readonly type = LANGUAGE_LOAD_ALL_SUCCESS;

  constructor(readonly payload: {translations: any[], languages:string[]}) {}
}

export class LanguageLoadAllFailAction implements Action {
  readonly type = LANGUAGE_LOAD_ALL_FAIL;

  constructor(readonly payload: any) {}
}

export class LanguageSaveAction implements Action {
  readonly type = LANGUAGE_SAVE;

  constructor(readonly payload:{language:string, json: string}) {}
}

export class LanguageSaveSuccessAction implements Action {
  readonly type = LANGUAGE_SAVE_SUCCESS;
}

export class LanguageSaveFailAction implements Action {
  readonly type = LANGUAGE_SAVE_FAIL;
  constructor(readonly payload: any) {}
}

export class LanguageSaveAllAction implements Action {
  readonly type = LANGUAGE_SAVE_ALL;

  constructor(readonly payload:string) {}
}

export class LanguageSaveAllSuccessAction implements Action {
  readonly type = LANGUAGE_SAVE_ALL_SUCCESS;
}

export class LanguageSaveAllFailAction implements Action {
  readonly type = LANGUAGE_SAVE_ALL_FAIL;
  constructor(readonly payload: any) {}
}

export type Actions
  = LanguageResetServerAction
  | LanguageSetMissingServerAction
  | LanguageSetReferenceLanguageAction
  | LanguageSetReferenceLanguageSuccessAction
  | LanguageLoadAllAction
  | LanguageLoadAllSuccessAction
  | LanguageLoadAllFailAction
  | LanguageLoadAction
  | LanguageLoadSuccessAction
  | LanguageLoadFailAction
  | LanguageSaveAction
  | LanguageSaveSuccessAction
  | LanguageSaveFailAction
  | LanguageSaveAllAction
  | LanguageSaveAllSuccessAction
  | LanguageSaveAllFailAction;
