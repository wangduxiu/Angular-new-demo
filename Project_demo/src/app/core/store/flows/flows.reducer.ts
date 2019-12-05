import { placeToConverter } from 'app/core/store/orders/orders.reducer';
import { util } from '../../util/util';
import { Florder, FlowLineItem } from '../florders/florder.interface';
import { initialStateFlordersFilter } from '../florders/florders-filter.model';
import { Florders } from '../florders/florders.interface';
import { initialState } from '../florders/florders.model';
import { emptyPlace } from '../florders/place.model';
import * as actions from './flows.actions';

// let filterValuesLoadedCounter = 0;

export function reducer(state = initialState, action: actions.Actions): Florders {
  switch (action.type) {
    case actions.FLOWS_SET_FILTER: {
      return Object.assign({}, state, {
        filter: { ...action.payload.filter },
      });
    }

    case actions.FLOWS_CLEAR: {
      return {
        ...initialState,
        filterValues: state.filterValues,
      };
    }

    case actions.FLOWS_LOAD: {
      return Object.assign({}, state, {
        loading: true,
        filter: { ...(action.payload && action.payload.filter || state.filter) },
      });
    }

    /*
ExecuteHandshake?
    TRUE ->
        handshakeDate = null ?
            TRUE ->
                originalQuantity = 0 ?
                    TRUE -> edit sender quantities, show ACCEPT button
                    FALSE -> edit receiver quantities, show ACCEPT button
            FALSE -> show ACCEPT button, show definitive amount as original amount, no edit possible, quantity in the message equals already registered handshake amount
    FALSE ->
        status = 02 ?
            TRUE -> show CANCEL button
            FALSE -> no edit, no buttons
     */
    case actions.FLOWS_LOAD_SUCCESS: {
      const definitions = action.payload.definitions;
      const places = action.payload.places;
      const flows = action.payload.flows;

      const items = flows.items.map(flow => {
        let globalType = null;
        if (flow.executeHandshake) {
          globalType = flow.flowLineItems.length > 0 && definitions.global.type.find(gt => gt.id === ((util.isNumeric('' + flow.flowLineItems[0].originalQuantity) && ('' + flow.flowLineItems[0].originalQuantity) !== '0') ? 'IN' : 'OUT'));
        }

        let editOriginalQuantity = false;
        let editDefinitiveQuantity = false;
        let canCancel = false;
        let cannotEdit = false;

        // Sort flowLineItems
        const flowLineItems = [...flow.flowLineItems];
        if (flowLineItems && flowLineItems.length > 1) {
          flowLineItems.sort((a, b) => a.itemNumber - b.itemNumber);
        }
        if (flow.executeHandshake) {
          const firstLine: FlowLineItem = flowLineItems && flowLineItems.length && flowLineItems[0];
          if (firstLine && !flow.handshakeDate) { // can edit the values
            if (util.isNumeric('' + firstLine.originalQuantity) && ('' + firstLine.originalQuantity) !== '0') {
              editDefinitiveQuantity = true;
            } else {
              editOriginalQuantity = true;
            }
          } else {
            cannotEdit = true;
          }
        } else {
          canCancel = flow.handshakeStatus === '02';
        }

        return {
          ...flow,
          globalType,
          editOriginalQuantity,
          editDefinitiveQuantity,
          canCancel,
          from: places[flow.from.id] || Object.assign({}, emptyPlace, {
            id: flow.from.id,
            name: flow.from.name,
          }),
          to: places[flow.to.id] || Object.assign({}, emptyPlace, {
            id: flow.to.id,
            name: flow.to.name,
          }),
          // shippingCondition: flow.transport && definitions.transport.type.find(t => t.id === flow.transport) || { id: flow.transport as string, name: flow.transport as string },
          shippingCondition: null,
          status: flow.handshakeStatus && definitions.flow.status.find(st => st.id === flow.handshakeStatus),
          ccr: null,
          flowLineItems: flowLineItems.map(fli => {
            return {
              ...fli,
              originalQuantity: (cannotEdit && flow.executeHandshake || editOriginalQuantity) ? fli.definitiveQuantity : fli.originalQuantity,
              definitiveQuantity: editDefinitiveQuantity ? fli.originalQuantity : fli.definitiveQuantity,
            };
          }),
        } as Florder;
      });
      return {
        filterValues: state.filterValues,
        loaded: true,
        loading: false,
        downloading: false,
        items: items.map(item => {
          return {
            ...item,
          };
        }),
        filter: state.filter,
        totalItems: flows.totalItems,
        handshaking: false,
        handshaked: false,
      };
    }

    case actions.FLOWS_LOAD_FAIL: {
      return {
        filterValues: state.filterValues,
        loaded: false,
        loading: false,
        downloading: false,
        items: [],
        totalItems: null,
        filter: state.filter,
        handshaking: false,
        handshaked: false,
      };
    }

    case actions.FLOWS_DOWNLOAD: {
      return Object.assign({}, state, { downloading: true });
    }

    case actions.FLOWS_DOWNLOAD_SUCCESS: {
      return Object.assign({}, state, { downloading: false });
    }

    case actions.FLOWS_DOWNLOAD_FAIL: {
      return Object.assign({}, state, { downloading: false });
    }

    case actions.FLOWS_SET_FILTER_OPEN_HANDSHAKES: {
      return Object.assign({}, state, {
        filter: {
          ...initialStateFlordersFilter,
          florderDateFrom: '',
          flowStatus_01: false,
          flowStatus_03: false,
          flowStatus_04: false,
          flowStatus_05: false,
        },
        loading: true,
        items: [],
      });
    }

    case actions.FLOWS_ACCEPT_FLOW_START: {
      return Object.assign({}, state, {
        handshaking: true,
        handshaked: null,
      });
    }

    case actions.FLOWS_ACCEPT_FLOW_SUCCESS: {
      return Object.assign({}, state, {
        handshaking: false,
        handshaked: true,
        items: state.items.map(item => {
          if (item.etmOrderNumber === action.payload.etmOrderNumber) {
            return {
              ...item,
              status: action.payload.status,
            };
          } else {
            return item;
          }
        }),
      });
    }

    case actions.FLOWS_ACCEPT_FLOW_FAIL: {
      return Object.assign({}, state, {
        handshaking: false,
        handshaked: false,
      });
    }

    case actions.FLOWS_ACCEPT_FLOW_FROM_BATCH_START: {
      return Object.assign({}, state, {
        items: state.items.map(flow => {
          if (flow.etmOrderNumber === action.payload.flow.etmOrderNumber) {
            return {
              ...flow,
              blacklisted: true,
            };
          } else {
            return flow;
          }
        }),
      });
    }

    case actions.FLOWS_ACCEPT_FLOW_FROM_BATCH_SUCCESS: {
      return Object.assign({}, state, {
        items: state.items.map(flow => {
          if (flow.etmOrderNumber === action.payload.flow.etmOrderNumber) {
            return {
              ...flow,
              status: action.payload.status,
              blacklisted: false,
              failed: false,
              failMessage: null,
              executeHandshake: false,
            };
          } else {
            return flow;
          }
        }),
      });
    }

    case actions.FLOWS_ACCEPT_FLOW_FROM_BATCH_FAIL: {
      return Object.assign({}, state, {
        items: state.items.map(flow => {
          if (flow.etmOrderNumber === action.payload.flow.etmOrderNumber) {
            return {
              ...flow,
              failed: true,
              failMessage: util.getErrorMessage(action.payload),
              blacklisted: false,
            };
          } else {
            return flow;
          }
        }),
      });
    }

    case actions.FLOWS_CANCEL_FLOW_START: {
      return Object.assign({}, state, {
        handshaking: true,
        handshaked: null,
      });
    }

    case actions.FLOWS_CANCEL_FLOW_SUCCESS: {
      return Object.assign({}, state, {
        handshaking: false,
        handshaked: true,
        items: state.items.map(item => {
          if (item.etmOrderNumber === action.payload.etmOrderNumber) {
            return {
              ...item,
              status: action.payload.status,
            };
          } else {
            return item;
          }
        }),
      });
    }

    case actions.FLOWS_CANCEL_FLOW_FAIL: {
      return Object.assign({}, state, {
        handshaking: false,
        handshaked: false,
      });
    }

    case actions.FLOWS_FILTER_VALUES_RESET: {
      return {
        ...state,
        filterValues: {
          ...initialState.filterValues,
        },
      };
    }

    case actions.FLOWS_FILTER_VALUES_LOAD: {
      return {
        ...state,
        filterValues: {
          ...initialState.filterValues,
          loading: true,
          customerId: action.payload.customerId,
        },
      };
    }

    case actions.FLOWS_FILTER_VALUES_LOAD_SUCCESS: {
      // filterValuesLoadedCounter++;
      const stringToDefinition = id => {
        return {
          id,
          name: id,
        };
      };
      const idToDefinition = array => (id => array.find(t => t.id === id) || {
        id,
        name: id,
      });
      const filterValues = action.payload.filterValues;
      const definitions = action.payload.definitions;
      const nameComparator = (a, b) => a && b && a.name.localeCompare(b.name) || a && !b && -1 || !a && b && 1 || 0;
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          loading: false,
          loaded: true,
          shippingConditions: filterValues.shippingCondition.map(idToDefinition(definitions.transport.type)).sort(nameComparator),
          froms: filterValues.from.map(id => filterValues.locations.find(l => l.id === id)).sort(nameComparator),
          tos: filterValues.to.map(id => filterValues.locations.find(l => l.id === id)).sort(nameComparator),
          // locations: filterValues.locations.map(placeToConverter).filter((o, i) => filterValuesLoadedCounter > 1 || i % 3 != 0),
          locations: filterValues.locations.map(placeToConverter),
          orderTypes: filterValues.orderType.map(idToDefinition(definitions.flow.type)).sort(nameComparator),
          incoterms: [],
          pallets: filterValues.palletId.map(idToDefinition(definitions.pallet.type)).sort(nameComparator),
          packings: filterValues.packingId.map(idToDefinition(definitions.packing.type)).sort(nameComparator),
        },
      };
    }

    case actions.FLOWS_FILTER_VALUES_LOAD_FAIL: {
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          loading: false,
          failed: true,
        },
      };
    }

    default: {
      return state;
    }
  }
}
