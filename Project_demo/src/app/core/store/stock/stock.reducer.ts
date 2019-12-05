import * as actions from './stock.actions';
import { initialState } from './stock.model';
import { Stock } from './stock.interface';

export function reducer(state = initialState, action: actions.Actions): Stock {
  switch (action.type) {
    case actions.STOCK_LOAD: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case actions.STOCK_LOAD_SUCCESS: {
      const definitions = action.payload.definitions;
      const packingTypes = definitions.packing.type;
      return Object.assign({}, state, {
        loaded: true,
        loading: false,
        items: action.payload.items.map(item => {
          return {
            ...item,
            packingName: packingTypes.find(packing => {
              return packing.id == item.packingId;
            }).name
          }
        }),
        totalItems: action.payload.totalItems,
        location: action.payload.places[action.payload.filter.location],
      });
    }

    case actions.STOCK_LOAD_FAIL: {
      return Object.assign({}, state, {
        loaded: false,
        loading: false,
        items: [],
        totalItems: null,
        location: null,
      });
    }

    case actions.POWER_BI_URL_LOAD: {
      return Object.assign({}, state, {
        powerBIConfig: {
          loading: true,
          loaded: false,
        }
      });
    }

    case actions.POWER_BI_URL_LOAD_SUCCESS: {
      return Object.assign({}, state, {
        powerBIConfig: {
          ...action.payload,
          loading: false,
          loaded: true,
        }
      });
    }

    case actions.POWER_BI_URL_LOAD_FAIL: {
      return Object.assign({}, state, {
        powerBIConfig: {
          loading: false,
          loaded: false,
        }
      });
    }

    default: {
      return state;
    }
  }
}
