import {util} from '../../util/util';
import * as actionsFromCustomerSummary from '../customer-summary/customer-summary.actions';
import {CustomerSummaryMW} from '../customer-summary/customer-summary.interface';
import {initialCustomerSummary} from '../customer-summary/customer-summary.model';
import * as flowActions from '../flows/flows.actions';
import * as orderActions from '../orders/orders.actions';
import * as actionsFromSelectCustomer from '../select-customer/select-customer.actions';
import * as actionsFromUserContext from '../user-context/user-context.actions';
import {ContractDetails} from './contract-details.interface';
import {initialState} from './contract-details.model';
import {mapFlorderTypes} from './map-florder-types';

const fixArrayOrObjectIssue = (arrayOrObject) => {
  if (!arrayOrObject) return [];
  if (Array.isArray(arrayOrObject)) return arrayOrObject;
  else return [arrayOrObject];
};

export function reducer(state = initialState,
                        action:
                            actionsFromCustomerSummary.Actions
                          | actionsFromUserContext.Actions
                          | actionsFromSelectCustomer.Actions
                          | flowActions.Actions
                          | orderActions.Actions
): ContractDetails {
  let customerSummaryMW: CustomerSummaryMW;

  switch (action.type) {

    case flowActions.FLOW_TYPES_LOAD:
      return Object.assign({}, state, {
        flowTypesLoading: true,
      });

    case flowActions.FLOW_TYPES_LOAD_SUCCESS:
      let flowContract = Object.assign({}, state, {
        allFlowTypes: [],
        flowTypesLoading: false,
        flowTypesLoaded: true,
        flowRegistrationTypes: mapFlorderTypes(
          action.payload.flowTypes,
          action.payload.definitions,
          Object.keys(action.payload.locations).map(key => action.payload.locations[key]),
        ),
        locations: action.payload.locations,
        restrictions: {
          ...action.payload.restrictions,
          ...state.restrictions,
        },
        flowHandshakeTypes: action.payload.flowHandshakeTypes &&
          mapFlorderTypes(action.payload.flowHandshakeTypes, action.payload.definitions, Object.keys(action.payload.locations).map(key => action.payload.locations[key])) || [],
        handshakes: action.payload.handshakes,
        customerSummary: {
          ...state.customerSummary,
          shipTos: Object.keys(action.payload.shiptos).reduce((result, key) => {
            return [
              ...result,
              { id: key, name: action.payload.shiptos[key] },
            ];
          }, []),
        },
      });

      if (flowContract.flowRegistrationTypes.length && flowContract.flowHandshakeTypes.length) {
        util.deepMerge(flowContract.allFlowTypes, flowContract.flowRegistrationTypes, flowContract.flowHandshakeTypes);
      } else {
        flowContract.allFlowTypes = [...flowContract.flowRegistrationTypes, ...flowContract.flowHandshakeTypes];
      }

      if (!flowContract.flowRegistrationTypes || !flowContract.flowRegistrationTypes.length) {
        flowContract = Object.assign({}, flowContract, {
          authorization: {
            ...flowContract.authorization,
            FLOW: {
              ...flowContract.authorization.FLOW,
              CREATE: false,
              UPDATE: false,
            },
          },
        });
      }

      return flowContract;

    case flowActions.FLOW_TYPES_LOAD_FAIL:
      return Object.assign({}, state, {
        allFlowTypes: [],
        flowTypesLoading: false,
        flowTypesLoaded: false,
        flowHandshakeTypes: [],
      });

    case actionsFromCustomerSummary.CUSTOMER_STOCK_LOAD:
      return Object.assign({}, state, {
        customerSummary: {
          ...state.customerSummary,
          loadingStockOverview: true,
          stockOverview: {
            packingAmount: 0,
            palletAmount: 0,
          },
        },
      });

    case actionsFromCustomerSummary.CUSTOMER_STOCK_LOAD_SUCCESS:
      return Object.assign({}, state, {
        customerSummary: {
          ...state.customerSummary,
          loadingStockOverview: false,
          stockOverview: {
            packingAmount: action.payload.stock.PackingAmount,
            palletAmount: action.payload.stock.PalletAmount,
          },
        },
      });

    case actionsFromCustomerSummary.CUSTOMER_STOCK_LOAD_FAIL:
      return Object.assign({}, state, {
        customerSummary: {
          ...state.customerSummary,
          loadingStockOverview: false,
          stockOverview: {
            packingAmount: 0,
            palletAmount: 0,
          },
        },
      });

    case flowActions.DASHBOARD_TILE_LATEST_FLOWS_LOAD:
      return Object.assign({}, state, {
        customerSummary: {
          ...state.customerSummary,
          loadingLatestFlows: true,
          latestFlows: state.customerSummary.latestFlows,
          openHandshakes: {
            openHandshakeTotal: 0,
          },
        },
      });

    case flowActions.DASHBOARD_TILE_LATEST_FLOWS_LOAD_SUCCESS:
      return Object.assign({}, state, {
        customerSummary: {
          ...state.customerSummary,
          loadingLatestFlows: false,
          latestFlows: action.payload.flows.items,
          openHandshakes: {
            openHandshakeTotal: action.payload.flows.openHandshakes,
          },
        },
      });

    case flowActions.DASHBOARD_TILE_LATEST_FLOWS_LOAD_FAIL:
      return Object.assign({}, state, {
        customerSummary: {
          ...state.customerSummary,
          loadingLatestFlows: false,
          latestFlows: [],
          openHandshakes: {
            openHandshakeTotal: 0,
          },
        },
      });

    case orderActions.DASHBOARD_TILE_LATEST_ORDERS_LOAD:
      return Object.assign({}, state, {
        customerSummary: {
          ...state.customerSummary,
          latestOrders: state.customerSummary.latestOrders,
          loadingLatestOrders: true,
        },
      });

    case orderActions.DASHBOARD_TILE_LATEST_ORDERS_LOAD_SUCCESS:
      return Object.assign({}, state, {
        customerSummary: {
          ...state.customerSummary,
          loadingLatestOrders: false,
          latestOrders: action.payload.orders.items,
        },
      });

    case orderActions.DASHBOARD_TILE_LATEST_ORDERS_LOAD_FAIL:
      return Object.assign({}, state, {
        customerSummary: {
          ...state.customerSummary,
          loadingLatestOrders: false,
          latestOrders: [],
        },
      });

    case actionsFromUserContext.USERCONTEXT_LOAD_SUCCESS:
      return {
        ...state,
        authorization: {
          ...state.authorization,
          isAdmin: action.payload.isAdmin,
          isAgent: action.payload.isAgent,
          canRelocate: action.payload.canRelocate,
          adminRoles: {
            updateEpsUser: action.payload.isAgent || action.payload.adminRoles.updateEpsUser,
            updateClientUser: action.payload.isAgent || action.payload.adminRoles.updateClientUser,
            createClientUser: action.payload.isAgent || action.payload.adminRoles.createClientUser,
            reInvite: action.payload.isAgent || action.payload.adminRoles.reInvite,
            inviteClientUser: action.payload.isAgent || action.payload.adminRoles.inviteClientUser,
            inviteEpsUser: action.payload.isAgent || action.payload.adminRoles.inviteEpsUser,
            resetPassword: action.payload.isAgent || action.payload.adminRoles.resetPassword,
          },
        },
      };

    case actionsFromSelectCustomer.CLEAR_ACTIVE_CUSTOMER:
      return {
        ...state,
        loading: false,
        loaded: false,
        activeCustomerId: null,
        orderTypes: [],
        allFlowTypes: [],
        flowRegistrationTypes: [],
        flowHandshakeTypes: [],
        places: {},
        customerSummary: initialCustomerSummary,
        handshakes: {}
      };

    case actionsFromCustomerSummary.CUSTOMER_SUMMARY_SET_OUTDATED:
      return Object.assign({}, state, {
        ...state,
        customerSummary: {
          ...state.customerSummary,
          outdated: true
        }
      });

    case actionsFromCustomerSummary.CUSTOMER_SUMMARY_LOAD:
      return Object.assign({}, state, {
        ...state,
        customerSummary: {
          ...customerSummaryMW,
          loading: true,
          loaded: false,
        }
      });

    case actionsFromCustomerSummary.CUSTOMER_SUMMARY_LOAD_SUCCES:
      const UpToLowFlowMapperSummary = openHandshake => {
        return {
          etmOrderNumber: openHandshake.EtmOrderNumber,
          salesOrderNumber: openHandshake.SalesOrderNumber,
          deliveryNumber: openHandshake.DeliveryNumber,
          shipmentNumber: openHandshake.ShipmentNumber,
        }
      };
      const responseSummary = util.deepCopy(action.payload.customerSummary);
      customerSummaryMW = responseSummary as CustomerSummaryMW;

      return Object.assign({}, state, {
        ...state,
        customerSummary: {
          ...customerSummaryMW,
          loaded: true,
          loading: false,
          outdated: false,
          latestFlows: customerSummaryMW.latestFlows.map(UpToLowFlowMapperSummary),
          latestOrders: customerSummaryMW.latestOrders.map(UpToLowFlowMapperSummary),
          openHandshakes: {
            ...customerSummaryMW.openHandshakes,
            openHandshakeTotal: customerSummaryMW.openHandshakes.OpenHandshakeTotal,
            flows: customerSummaryMW.openHandshakes.OpenHandshakes.map(UpToLowFlowMapperSummary)
          },
          stockOverview: {
            palletAmount: customerSummaryMW.stockOverview.PalletAmount,
            packingAmount: customerSummaryMW.stockOverview.PackingAmount,
          },
          shipTos: Object.keys(customerSummaryMW.shipTos).reduce((result, key) => {
            return [
              ...result,
              { id: key, name: customerSummaryMW.shipTos[key] }
            ]
          }, [])
        }
      });

    default:
      return state;
  }
}
