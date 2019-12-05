import { Action } from '@ngrx/store';
import { Definitions } from '../definitions/definitions.interface';
import { FlorderDetail } from '../florder-detail/florder-detail.interface';
import { Place } from '../florders/place.interface';
import { CalendarFilter } from './calendar-filter.interface';
import { CalendarDay, DayWithFlordersInfo } from './calendar.interface';
import { FlordersFilter } from '../florders/florders-filter.interface';

export const CALENDAR_ORDERS_LOAD = 'calendar:CALENDAR_ORDERS_LOAD';
export const CALENDAR_ORDERS_LOAD_FAIL = 'calendar:CALENDAR_ORDERS_LOAD_FAIL';
export const CALENDAR_ORDERS_LOAD_SUCCESS = 'calendar:CALENDAR_ORDERS_LOAD_SUCCESS';

export const CALENDAR_RELOCATIONS_LOAD = 'calendar:CALENDAR_RELOCATIONS_LOAD';
export const CALENDAR_RELOCATIONS_LOAD_FAIL = 'calendar:CALENDAR_RELOCATIONS_LOAD_FAIL';
export const CALENDAR_RELOCATIONS_LOAD_SUCCESS = 'calendar:CALENDAR_RELOCATIONS_LOAD_SUCCESS';
export const CALENDAR_RELOCATIONS_FILTER = 'calendar:CALENDAR_RELOCATIONS_FILTER';

export const CALENDAR_SHOW_CREATE_ORDER_MODAL = 'calendar:CALENDAR_SHOW_CREATE_ORDER_MODAL';
export const CALENDAR_SHOW_CREATE_RELOCATION_MODAL = 'calendar:CALENDAR_SHOW_CREATE_RELOCATION_MODAL';

export const CALENDAR_TEMPLATE_SELECTED = 'calendar:CALENDAR_TEMPLATE_SELECTED';

export const CALENDAR_REQUEST_ORDER_DELIVERY_DATES = 'calendar:CALENDAR_REQUEST_ORDER_DELIVERY_DATES';
export const CALENDAR_REQUEST_ORDER_DELIVERY_DATES_FAIL = 'calendar:CALENDAR_REQUEST_ORDER_DELIVERY_DATES_FAIL';
export const CALENDAR_REQUEST_ORDER_DELIVERY_DATES_SUCCESS = 'calendar:CALENDAR_REQUEST_ORDER_DELIVERY_DATES_SUCCESS';

export const CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES = 'calendar:CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES';
export const CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES_FAIL = 'calendar:CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES_FAIL';
export const CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES_SUCCESS = 'calendar:CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES_SUCCESS';

export const CALENDAR_CLEAR_STATE = 'calendar:CALENDAR_CLEAR_STATE';

export class CalendarOrdersLoadAction implements Action {
  readonly type = CALENDAR_ORDERS_LOAD;

  ui = {
    id: CALENDAR_ORDERS_LOAD,
    busy: true,
  };

  constructor(readonly payload: { definitions: Definitions; places: { [key: string]: Place }; filter?: FlordersFilter; }) {
  }
}

export class CalendarOrdersLoadSuccessAction implements Action {
  readonly type = CALENDAR_ORDERS_LOAD_SUCCESS;
  readonly module = 'order';

  ui = {
    id: CALENDAR_ORDERS_LOAD,
    busy: false,
  };

  constructor(readonly payload: { days: DayWithFlordersInfo[]; }) {
  }
}

export class CalendarOrdersLoadFailAction implements Action {
  readonly type = CALENDAR_ORDERS_LOAD_FAIL;

  ui = {
    id: CALENDAR_ORDERS_LOAD,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class CalendarRelocationsLoadAction implements Action {
  readonly type = CALENDAR_RELOCATIONS_LOAD;

  ui = {
    id: CALENDAR_RELOCATIONS_LOAD,
    busy: true,
  };

  constructor(readonly payload: { definitions: Definitions; places: { [key: string]: Place }; filter?: FlordersFilter; }) {
  }
}

export class CalendarRelocationsLoadSuccessAction implements Action {
  readonly type = CALENDAR_RELOCATIONS_LOAD_SUCCESS;
  readonly module = 'relocation';

  ui = {
    id: CALENDAR_RELOCATIONS_LOAD,
    busy: false,
  };

  constructor(readonly payload: { days: DayWithFlordersInfo[]; }) {
  }
}

export class CalendarRelocationsLoadFailAction implements Action {
  readonly type = CALENDAR_RELOCATIONS_LOAD_FAIL;

  ui = {
    id: CALENDAR_RELOCATIONS_LOAD,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class CalendarRelocationsFilterAction implements Action {
  readonly type = CALENDAR_RELOCATIONS_FILTER;

  constructor(readonly payload: { filter?: CalendarFilter }) {
  }
}

export class ShowCreateOrderModalAction implements Action {
  readonly type = CALENDAR_SHOW_CREATE_ORDER_MODAL;

  constructor(readonly payload: {
    day: CalendarDay;
    filter: FlordersFilter;
    templates: FlorderDetail[];
    definitions: Definitions;
    places: {
      [key: string]: Place;
    };
  }) {
  }
}

export class ShowCreateRelocationModalAction implements Action {
  readonly type = CALENDAR_SHOW_CREATE_RELOCATION_MODAL;

  constructor(readonly payload: {
    day: CalendarDay;
    filter: FlordersFilter;
    templates: FlorderDetail[];
    definitions: Definitions;
    places: {
      [key: string]: Place;
    };
  }) {
  }
}

export class CalendarTemplateSelectedAction implements Action {
  readonly type = CALENDAR_TEMPLATE_SELECTED;

  constructor(readonly payload: FlorderDetail) {
  }
}

export class CalendarRequestOrderDeliveryDatesAction implements Action {
  readonly type = CALENDAR_REQUEST_ORDER_DELIVERY_DATES;

  ui = {
    id: CALENDAR_REQUEST_ORDER_DELIVERY_DATES,
    busy: true,
  };

  constructor() {
  }
}

export class CalendarRequestOrderDeliveryDatesSuccessAction implements Action {
  readonly type = CALENDAR_REQUEST_ORDER_DELIVERY_DATES_SUCCESS;

  ui = {
    id: CALENDAR_REQUEST_ORDER_DELIVERY_DATES,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class CalendarRequestOrderDeliveryDatesFailAction implements Action {
  readonly type = CALENDAR_REQUEST_ORDER_DELIVERY_DATES_FAIL;

  ui = {
    id: CALENDAR_REQUEST_ORDER_DELIVERY_DATES,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class CalendarRequestRelocationUnloadingDatesAction implements Action {
  readonly type = CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES;

  ui = {
    id: CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES,
    busy: true,
  };

  constructor() {
  }
}

export class CalendarRequestRelocationUnloadingDatesSuccessAction implements Action {
  readonly type = CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES_SUCCESS;

  ui = {
    id: CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class CalendarRequestRelocationUnloadingDatesFailAction implements Action {
  readonly type = CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES_FAIL;

  ui = {
    id: CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES,
    busy: false,
  };

  constructor(readonly payload: any) {
  }
}

export class CalendarClearStateAction implements Action {
  readonly type = CALENDAR_CLEAR_STATE;
}

export type Actions =
  | CalendarOrdersLoadAction
  | CalendarOrdersLoadSuccessAction
  | CalendarOrdersLoadFailAction
  | CalendarRelocationsLoadAction
  | CalendarRelocationsLoadSuccessAction
  | CalendarRelocationsLoadFailAction
  | CalendarRelocationsFilterAction
  | ShowCreateOrderModalAction
  | ShowCreateRelocationModalAction
  | CalendarTemplateSelectedAction
  | CalendarRequestOrderDeliveryDatesAction
  | CalendarRequestOrderDeliveryDatesSuccessAction
  | CalendarRequestOrderDeliveryDatesFailAction
  | CalendarRequestRelocationUnloadingDatesAction
  | CalendarRequestRelocationUnloadingDatesSuccessAction
  | CalendarRequestRelocationUnloadingDatesFailAction
  | CalendarClearStateAction
  ;
