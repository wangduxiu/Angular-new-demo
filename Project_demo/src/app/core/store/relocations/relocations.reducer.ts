import {Florder, FlorderTO} from '../florders/florder.interface';
import {Florders} from '../florders/florders.interface';
import {initialState} from '../florders/florders.model';
import {emptyPlace} from '../florders/place.model';
import * as actions from './relocations.actions';

export function reducer(state = initialState, action: actions.Actions): Florders {
  switch (action.type) {
    case actions.RELOCATIONS_SET_FILTER: {
      return Object.assign({}, state, {
        filter: { ...action.payload.filter }
      });
    }

    case actions.RELOCATIONS_LOAD: {
      return Object.assign({}, state, {
        loading: true,
        filter: { ...(action.payload && action.payload.filter || state.filter) }
      });
    }

    case actions.RELOCATIONS_LOAD_SUCCESS: {
      const definitions = action.payload.definitions;
      const places = action.payload.places;
      const relocations = action.payload.relocations;
      const items = relocations.items.map((relocation: FlorderTO) => {
        return {
          ...relocation,
          from: relocation.from && (places[relocation.from.id] || Object.assign({}, emptyPlace, { id: relocation.from.id, name: relocation.from.name })) || { ...emptyPlace },
          to: relocation.to && (places[relocation.to.id] || Object.assign({}, emptyPlace, { id: relocation.to.id, name: relocation.to.name })) || { ...emptyPlace },
          shippingCondition: relocation.transport && definitions.transport.type.find(t => t.id === relocation.transport) || { id: relocation.transport as string, name: relocation.transport as string },
          globalType: relocation.globalType && definitions.global.type.find(gt => gt.id === (relocation.globalType && (relocation.globalType as string).toUpperCase())) || { id: relocation.globalType as string, name: relocation.globalType as string }, // TODO hack voor fout MW.
          status: relocation.orderStatus && definitions.order.status.find(st => parseInt(st.id, 10) === parseInt(relocation.orderStatus, 10)),
          ccr: null,
        } as Florder;
      });
      return {
        loaded: true,
        loading: false,
        filterValues: state.filterValues,
        downloading: false,
        items: items.map(item => {
          return {
            ...item
          };
        }),
        totalItems: relocations.totalItems,
        filter: state.filter
      };
    }

    case actions.RELOCATIONS_LOAD_FAIL: {
      return {
        loaded: false,
        loading: false,
        downloading: false,
        filterValues: state.filterValues,
        items: [],
        totalItems: null,
        filter: state.filter
      };
    }

    default: {
      return state;
    }
  }
}
