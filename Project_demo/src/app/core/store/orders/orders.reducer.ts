import { Place, PlaceTO } from 'app/core/store/florders/place.interface';
import * as moment from 'moment';
import * as _ from 'typedash';
import { Florder, FlorderTO } from '../florders/florder.interface';
import { Florders } from '../florders/florders.interface';
import { initialState } from '../florders/florders.model';
import { emptyPlace } from '../florders/place.model';
import * as actions from './orders.actions';

// let filterValuesLoadedCounter = 0;

export function placeToConverter(placeTo: PlaceTO) {
  let address = {};
  try {
    if (typeof placeTo.address === 'string') {
      address = JSON.parse(placeTo.address as string);
      if (address['houseNo']) {
        address['street'] = `${address['street']} ${address['houseNo']}`;
      }
    }
  } catch (e) {
    // Ignore parsing issue
  }
  return {
      ...placeTo,
      address,
      openingHours: _.compact(_.flatten(placeTo.openingHours && placeTo.openingHours.length && placeTo.openingHours[0]['Day']).map((day) => {
        return day && {
            weekday: day['weekday'],
            weekdayNr: _.indexOf(['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'], day['weekday']),// ROALD guarantees that this will be stable, it won't change to another language all of the sudden
            slots: _.compact([day['Morning'], day['Afternoon']]).map((slot) => {
              return {
                from: moment(slot.from, 'H:mm:ss').format('H[h]mm'),
                to: moment(slot.to, 'H:mm:ss').format('H[h]mm'),
              };
            }),
          };
      }),
      ),
    } as Place;
}

export const mapFlordersTo2Florders = ({ orders, places, definitions }) => {
  const items = orders.items.map((order: FlorderTO) => {
    return {
      ...order,
      from: order.from && (places[order.from.id] || Object.assign({}, emptyPlace, { id: order.from.id, name: order.from.name })) || { ...emptyPlace },
      to: order.to && (places[order.to.id] || Object.assign({}, emptyPlace, { id: order.to.id, name: order.to.name })) || { ...emptyPlace },
      shippingCondition: order.transport && definitions.transport.type.find(t => t.id === order.transport) || { id: order.transport as string, name: order.transport as string },
      incoterm: order.incoterm,
      globalType: order.globalType && definitions.global.type.find(gt => gt.id === (order.globalType && (order.globalType as string).toUpperCase())) || {
        id: order.globalType as string,
        name: order.globalType as string,
      }, // TODO hack voor fout MW.
      status: order.orderStatus && definitions.order.status.find(st => parseInt(st.id, 10) === parseInt(order.orderStatus, 10)) || { id: order.orderStatus, name: order.orderStatus },
      canCreateCcr: !!order.canCreateCcr,
      ccr: order.ccr && {
        ...order.ccr,
        open: order.ccr.approved && order.ccr.approved.toLowerCase() === 'open',
        accepted: order.ccr.approved && order.ccr.approved.toLowerCase() === 'accepted',
        declined: order.ccr.approved && order.ccr.approved.toLowerCase() === 'declined',
        UI: {
          submittingAccept: false,
          submittingReject: false,
        },
      },
    } as Florder;
  });
  return items;
};

export function reducer(state = initialState, action: actions.Actions): Florders {
  switch (action.type) {
    case actions.ORDERS_SET_FILTER: {
      return Object.assign({}, state, {
        filter: { ...action.payload.filter },
      });
    }
    case actions.ORDERS_CLEAR: {
      return {
        ...initialState,
        filterValues: state.filterValues,
      };
    }

    case actions.ORDERS_LOAD: {
      return Object.assign({}, state, {
        loading: true,
        filter: { ...(action.payload && action.payload.filter || state.filter) },
      });
    }

    case actions.ORDERS_LOAD_SUCCESS: {
      const items = mapFlordersTo2Florders(action.payload);
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
        totalItems: action.payload.orders.totalItems,
        filter: state.filter,
      };
    }

    case actions.ORDERS_LOAD_FAIL: {
      return {
        filterValues: state.filterValues,
        loaded: false,
        loading: false,
        downloading: false,
        items: [],
        totalItems: null,
        filter: state.filter,
      };
    }

    case actions.ORDERS_DOWNLOAD: {
      return Object.assign({}, state, { downloading: true });
    }

    case actions.ORDERS_DOWNLOAD_SUCCESS: {
      return Object.assign({}, state, { downloading: false });
    }

    case actions.ORDERS_DOWNLOAD_FAIL: {
      return Object.assign({}, state, { downloading: false });
    }

    case actions.ORDER_ACCEPT_DEVIATION: {
      return Object.assign({}, state, {
        items: state.items.map((order: Florder) => {
          if (order.ccr && order.ccr.ccrNumber === action.payload.ccrNumber) {
            return {
              ...order,
              ccr: {
                ...order.ccr,
                UI: {
                  submittingAccept: true,
                  submittingReject: order.ccr.UI.submittingReject,
                },
              },
            };
          }
          return order;
        }),
      });
    }

    case actions.ORDER_REJECT_DEVIATION: {
      return Object.assign({}, state, {
        items: state.items.map((order: Florder) => {
          if (order.ccr && order.ccr.ccrNumber === action.payload.ccrNumber) {
            return {
              ...order,
              ccr: {
                ...order.ccr,
                UI: {
                  submittingAccept: order.ccr.UI.submittingAccept,
                  submittingReject: true,
                },
              },
            };
          }
          return order;
        }),
      });
    }

    case actions.ORDER_ACCEPT_DEVIATION_SUCCESS: {
      return Object.assign({}, state, {
        items: state.items.map((order: Florder) => {
          if (order.ccr && order.ccr.ccrNumber === action.payload.ccrNumber) {
            return {
              ...order,
              ccr: {
                ...order.ccr,
                accepted: true,
                open: false,
                UI: {
                  submittingAccept: false,
                  submittingReject: order.ccr.UI.submittingReject,
                },
              },
            };
          }
          return order;
        }),
      });
    }

    case actions.ORDER_ACCEPT_DEVIATION_FAIL: {
      return Object.assign({}, state, {
        items: state.items.map((order: Florder) => {
          if (order.ccr && order.ccr.ccrNumber === action.payload.ccrNumber) {
            return {
              ...order,
              ccr: {
                ...order.ccr,
                UI: {
                  submittingAccept: false,
                  submittingReject: order.ccr.UI.submittingReject,
                },
              },
            };
          }
          return order;
        }),
      });
    }

    case actions.ORDER_REJECT_DEVIATION_SUCCESS: {
      return Object.assign({}, state, {
        items: state.items.map((order: Florder) => {
          if (order.ccr && order.ccr.ccrNumber === action.payload.ccrNumber) {
            return {
              ...order,
              ccr: {
                ...order.ccr,
                declined: true,
                open: false,
                UI: {
                  submittingAccept: order.ccr.UI.submittingAccept,
                  submittingReject: false,
                },
              },
            };
          }
          return order;
        }),
      });
    }

    case actions.ORDER_REJECT_DEVIATION_FAIL: {
      return Object.assign({}, state, {
        items: state.items.map((order: Florder) => {
          if (order.ccr && order.ccr.ccrNumber === action.payload.ccrNumber) {
            return {
              ...order,
              ccr: {
                ...order.ccr,
                UI: {
                  submittingAccept: order.ccr.UI.submittingAccept,
                  submittingReject: false,
                },
              },
            };
          }
          return order;
        }),
      });
    }

    case actions.ORDERS_FILTER_VALUES_RESET: {
      return {
        ...state,
        filterValues: {
          ...initialState.filterValues,
        },
      };
    }


    case actions.ORDERS_FILTER_VALUES_LOAD: {
      return {
        ...state,
        filterValues: {
          ...initialState.filterValues,
          loading: true,
          customerIds: action.payload.customerIds,

        },
      };
    }

    case actions.ORDERS_FILTER_VALUES_LOAD_SUCCESS: {
      // filterValuesLoadedCounter++;
      const stringToDefinition = id => {
        return { id, name: id };
      };
      const idToDefinition = array => (id => array.find(t => t.id === id) || { id, name: id });
      const filterValues = action.payload.filterValues;
      const definitions = action.payload.definitions;
      const nameComparator = (a, b) => a.name.localeCompare(b.name);
      const idToLocationMapper = (id: string): PlaceTO => {
        let location = filterValues.locations.find(l => l.id === id);
        if (!location) {
          location = {
            address: {},
            openingHours: [],
            type: '',
            id,
            name: id,
          };
        }
        return location;
      };
      return {
        ...state,
        filterValues: {
          ...state.filterValues,
          loading: false,
          loaded: true,
          shippingConditions: filterValues.shippingCondition.map(idToDefinition(definitions.transport.type)).sort(nameComparator),
          froms: filterValues.from.map(idToLocationMapper).sort(nameComparator),
          tos: filterValues.to.map(idToLocationMapper).sort(nameComparator),
          locations: filterValues.locations.map(placeToConverter),
          // locations: filterValues.locations.map(placeToConverter).filter((o, i) => filterValuesLoadedCounter > 1 || i % 3 != 0),
          orderTypes: filterValues.orderType.map(idToDefinition(definitions.order.type)).sort(nameComparator),
          incoterms: filterValues.incoTerm.map(idToDefinition(definitions.order.incoterm)).sort(nameComparator),
          pallets: filterValues.palletId.map(idToDefinition(definitions.pallet.type)).sort(nameComparator),
          packings: filterValues.packingId.map(idToDefinition(definitions.packing.type)).sort(nameComparator),
        },
      };
    }

    case actions.ORDERS_FILTER_VALUES_LOAD_FAIL: {
      return {
        ...state,
        filterValues: {
          ...initialState.filterValues,
        },
      };
    }

    default: {
      return state;
    }
  }
}
