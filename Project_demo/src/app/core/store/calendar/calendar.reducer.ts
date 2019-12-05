import * as actions from './calendar.actions';
import { CalendarFlorders } from './calendar.interface';
import { initialState } from './calendar.model';

export function reducer(state = initialState, action: actions.Actions): CalendarFlorders {
  switch (action.type) {
    case actions.CALENDAR_ORDERS_LOAD: {
      return Object.assign({}, state, {
        loading: true,
        UI: {
          startDate: action.payload.filter.florderDateFrom,
          endDate: action.payload.filter.florderDateTo,
        }
      });
    }

    case actions.CALENDAR_ORDERS_LOAD_SUCCESS: {
      const days = action.payload.days;
      return Object.assign({}, state, {
        loaded: true,
        loading: false,
        days,
      });
    }

    case actions.CALENDAR_RELOCATIONS_LOAD:
    case actions.CALENDAR_ORDERS_LOAD_FAIL: {
      return Object.assign({}, state, {
        loaded: false,
        loading: false,
        items: [],
        filteredItems: [],
        totalItems: null,
      });
    }

    case actions.CALENDAR_RELOCATIONS_LOAD_SUCCESS: {
      const days = action.payload.days;
      return Object.assign({}, state, {
        loaded: true,
        loading: false,
        days,
      });
    }

    case actions.CALENDAR_RELOCATIONS_LOAD_FAIL: {
      return Object.assign({}, state, {
        loaded: false,
        loading: false,
        items: [],
        filteredItems: [],
        totalItems: null,
      });
    }

    case actions.CALENDAR_TEMPLATE_SELECTED: {
      return Object.assign({}, state, {
        selectedTemplate: state.selectedTemplate == action.payload ? null : action.payload,
        availableDays: state.selectedTemplate == action.payload || !action.payload ? null : state.availableDays,
      });
    }

    case actions.CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES:
    case actions.CALENDAR_REQUEST_ORDER_DELIVERY_DATES: {
      return Object.assign({}, state, {
        deliveryDaysRequesting: true,
        deliveryDaysRequested: false,
        availableDays: null,
      });
    }

    case actions.CALENDAR_REQUEST_ORDER_DELIVERY_DATES_SUCCESS: {
      return Object.assign({}, state, {
        deliveryDaysRequesting: false,
        deliveryDaysRequested: true,
        availableDays: action.payload,
      });
    }

    case actions.CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES_SUCCESS: {
      return Object.assign({}, state, {
        deliveryDaysRequesting: false,
        deliveryDaysRequested: true,
        availableDays: {
          full: action.payload.toDates,
          nonFull: action.payload.toDates
        },
      });
    }

    case actions.CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES_FAIL:
    case actions.CALENDAR_REQUEST_ORDER_DELIVERY_DATES_FAIL: {
      return Object.assign({}, state, {
        deliveryDaysRequesting: false,
        deliveryDaysRequested: false,
        availableDays: null,
        selectedTemplate: null,
      });
    }

    case actions.CALENDAR_CLEAR_STATE: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}
