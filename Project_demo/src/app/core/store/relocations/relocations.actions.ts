import { Action } from '@ngrx/store';
import { Florder } from '../florders/florder.interface';
import { FlordersFilter } from '../florders/florders-filter.interface';
import { Definitions } from '../definitions/definitions.interface';
import { Place } from '../florders/place.interface';
import { FlordersTO } from '../florders/florders.interface';

export const RELOCATIONS_SET_FILTER = 'relocations:RELOCATIONS_SET_FILTER';
export const RELOCATIONS_LOAD = 'relocations:RELOCATIONS_LOAD';
export const RELOCATIONS_LOAD_FAIL = 'relocations:RELOCATIONS_LOAD_FAIL';
export const RELOCATIONS_LOAD_SUCCESS = 'relocations:RELOCATIONS_LOAD_SUCCESS';

export class RelocationsSetFilterAction implements Action {
  readonly type = RELOCATIONS_SET_FILTER;

  constructor(readonly payload: { filter: FlordersFilter }) {
  }
}

export class RelocationsLoadAction implements Action {
  readonly type = RELOCATIONS_LOAD;

  constructor(readonly payload?: { filter: FlordersFilter }) {
  }
}

export class RelocationsLoadSuccessAction implements Action {
  readonly type = RELOCATIONS_LOAD_SUCCESS;

  constructor(readonly payload: { definitions: Definitions; places: Place[]; relocations: FlordersTO }) {
  }
}

export class RelocationsLoadFailAction implements Action {
  readonly type = RELOCATIONS_LOAD_FAIL;

  constructor(readonly payload: any) {
  }
}

export type Actions =
  RelocationsSetFilterAction
  | RelocationsLoadAction
  | RelocationsLoadSuccessAction
  | RelocationsLoadFailAction
;
