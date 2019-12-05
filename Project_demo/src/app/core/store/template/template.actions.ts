import { Action } from '@ngrx/store';
import { TemplateType } from 'app/core/store/template/template.interface';
import { Definition } from '../definitions/definition.interface';
import { Definitions } from '../definitions/definitions.interface';
import { OrderDetailTO } from '../florder-detail/florder-detail.interface';

export const ORDER_TEMPLATE_CREATE_START = 'template:ORDER_TEMPLATE_CREATE_START';
export const RELOCATION_TEMPLATE_CREATE_START = 'template:RELOCATION_TEMPLATE_CREATE_START';
export const TEMPLATE_SAVE_FROM_ORDER = 'template:TEMPLATE_SAVE_FROM_ORDER';
export const TEMPLATE_SAVE_FROM_RELOCATION = 'template:TEMPLATE_SAVE_FROM_RELOCATION';
export const TEMPLATE_SAVE_SUCCESS = 'template:TEMPLATE_SAVE_SUCCESS';
export const TEMPLATE_SAVE_FAIL = 'template:TEMPLATE_SAVE_FAIL';

export const TEMPLATE_COPY_FROM_ORDER = 'template:TEMPLATE_COPY_FROM_ORDER'; // copy order to template
export const TEMPLATE_COPY_FROM_ORDER_SUCCESS = 'template:TEMPLATE_COPY_FROM_ORDER_SUCCESS'; // copy order open order success for creat template

export const TEMPLATE_COPY_FROM_RELOCATION = 'template:TEMPLATE_COPY_FROM_RELOCATION'; // copy relocation to template
export const TEMPLATE_COPY_FROM_RELOCATION_SUCCESS = 'template:TEMPLATE_COPY_FROM_RELOCATION_SUCCESS'; // copy relocation to template success

export const TEMPLATES_LOAD = 'TEMPLATE:TEMPLATES_LOAD';
export const TEMPLATES_LOAD_FAIL = 'TEMPLATE:TEMPLATES_LOAD_FAIL';
export const TEMPLATES_LOAD_SUCCESS = 'TEMPLATE:TEMPLATES_LOAD_SUCCESS';

export const TEMPLATES_DELETE = 'TEMPLATE:TEMPLATES_DELETE';
export const TEMPLATES_DELETE_FAIL = 'TEMPLATE:TEMPLATES_DELETE_FAIL';
export const TEMPLATES_DELETE_SUCCESS = 'TEMPLATE:TEMPLATES_DELETE_SUCCESS';

export const TEMPLATES_START_EDIT = 'TEMPLATE:TEMPLATES_START_EDIT';
export const TEMPLATES_START_EDIT_FAIL = 'TEMPLATE:TEMPLATES_START_EDIT_FAIL';
export const TEMPLATES_START_EDIT_SUCCESS = 'TEMPLATE:TEMPLATES_START_EDIT_SUCCESS';

export const ORDER_TEMPLATE_EDIT = 'TEMPLATE:ORDER_TEMPLATE_EDIT';
export const RELOCATION_TEMPLATE_EDIT = 'TEMPLATE:RELOCATION_TEMPLATE_EDIT';

export class OrderTemplateCreateStart implements Action {
  readonly type = ORDER_TEMPLATE_CREATE_START;

  constructor(readonly payload: { activeCustomer: Definition }) {
  } // activeCustomer
}

export class RelocationTemplateCreateStart implements Action {
  readonly type = RELOCATION_TEMPLATE_CREATE_START;

  constructor(readonly payload: { activeCustomer: Definition }) {
  } // activeCustomer
}

export class TemplateCreateFromOrderStart implements Action {
  readonly type = TEMPLATE_COPY_FROM_ORDER;

  constructor(readonly payload: { etmOrderNumber: string}) {
  } // id
}

export class TemplateCreateFromOrderSuccess implements Action {
  readonly type = TEMPLATE_COPY_FROM_ORDER_SUCCESS;

  constructor(readonly payload: { definitions: Definitions, orderDetail: OrderDetailTO }) {
  }
}

export class TemplateCreateFromRelocationStart implements Action {
  readonly type = TEMPLATE_COPY_FROM_RELOCATION;

  constructor(readonly payload: { etmOrderNumber: string }) {
  } // id
}

export class TemplateCreateFromRelocationSuccess implements Action {
  readonly type = TEMPLATE_COPY_FROM_RELOCATION_SUCCESS;

  constructor(readonly payload: { definitions: Definitions, relocationDetail: OrderDetailTO }) {
  }
}

export class TemplateSaveFromOrderAction implements Action {
  readonly type = TEMPLATE_SAVE_FROM_ORDER;

  constructor(readonly payload: { silentSuccess: boolean, create: boolean }) {
  }
}

export class TemplateSaveFromRelocationAction implements Action {
  readonly type = TEMPLATE_SAVE_FROM_RELOCATION;

  constructor(readonly payload: { silentSuccess: boolean, create: boolean }) {
  }
}

export class TemplateSaveSuccessAction implements Action {
  readonly type = TEMPLATE_SAVE_SUCCESS;

  constructor(readonly payload?: { silentSuccess: boolean, returnUrl: string }) {
  }
}

export class TemplateSaveFailAction implements Action {
  readonly type = TEMPLATE_SAVE_FAIL;

  constructor(readonly payload?: any) {
  }
}

export class TemplatesLoadAction implements Action {
  readonly type = TEMPLATES_LOAD;

  constructor(readonly payload: { type: TemplateType }) {
  }
}

export class TemplatesLoadSuccessAction implements Action {
  readonly type = TEMPLATES_LOAD_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class TemplatesLoadFailAction implements Action {
  readonly type = TEMPLATES_LOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export class TemplatesDeleteAction implements Action {
  readonly type = TEMPLATES_DELETE;

  constructor(readonly payload: { templateId: number, type: TemplateType }) {
  }
}

export class TemplatesDeleteSuccessAction implements Action {
  readonly type = TEMPLATES_DELETE_SUCCESS;

  constructor(readonly payload: any) {
  }
}

export class TemplatesDeleteFailAction implements Action {
  readonly type = TEMPLATES_DELETE_FAIL;

  constructor(readonly payload: any) {
  }
}

export class TemplatesStartEditAction implements Action {
  readonly type = TEMPLATES_START_EDIT;

  constructor(readonly payload: { type: TemplateType, templateId: number }) {
  }
}

export class TemplatesStartEditSuccessAction implements Action {
  readonly type = TEMPLATES_START_EDIT_SUCCESS;

  constructor(readonly payload: {template: any, type: TemplateType}) {
  }
}

export class TemplatesStartEditFailAction implements Action {
  readonly type = TEMPLATES_START_EDIT_FAIL;

  constructor(readonly payload: any) {
  }
}

export class OrderTemplateEditAction implements Action {
  readonly type = ORDER_TEMPLATE_EDIT;

  constructor(readonly payload: { template: any, definitions: Definitions }) {
  }
}

export class RelocationTemplateEditAction implements Action {
  readonly type = RELOCATION_TEMPLATE_EDIT;

  constructor(readonly payload: { template: any }) {
  }
}

export type Actions =
  OrderTemplateCreateStart
  | RelocationTemplateCreateStart
  | TemplateSaveFromOrderAction
  | TemplateSaveFromRelocationAction
  | TemplateSaveSuccessAction
  | TemplateSaveFailAction
  | TemplateCreateFromOrderStart
  | TemplateCreateFromOrderSuccess
  | TemplateCreateFromRelocationStart
  | TemplateCreateFromRelocationSuccess
  | TemplatesLoadAction
  | TemplatesLoadSuccessAction
  | TemplatesLoadFailAction
  | TemplatesDeleteAction
  | TemplatesDeleteSuccessAction
  | TemplatesDeleteFailAction
  | TemplatesStartEditAction
  | TemplatesStartEditSuccessAction
  | TemplatesStartEditFailAction
  | OrderTemplateEditAction
  | RelocationTemplateEditAction
  ;
