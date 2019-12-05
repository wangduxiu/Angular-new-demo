import { CustomerInfo } from 'app/core/store/customer-info/customer-info.interface';
import { initialState } from 'app/core/store/customer-info/customer-info.model';
import { Definition } from 'app/core/store/definitions/definition.interface';
import * as actionsFromSelectCustomer from 'app/core/store/select-customer/select-customer.actions';
import * as actionsFromUserContext from 'app/core/store/user-context/user-context.actions';
import { UserContextTO } from 'app/core/store/user-context/user-context.interface';
import { util } from 'app/core/util/util';
import * as moment from 'moment';
import * as _ from 'typedash';
import * as actions from './customer-info.actions';

const fixArrayOrObjectIssue = (arrayOrObject) => {
  if (!arrayOrObject) return [];
  if (Array.isArray(arrayOrObject)) return arrayOrObject;
  else return [arrayOrObject];
};

export function reducer(state = initialState,
                        action: actions.Actions
                          | actionsFromSelectCustomer.Actions
                          | actionsFromUserContext.Actions
  ,
): CustomerInfo {
  switch (action.type) {

    case actions.CUSTOMER_INFO_LOAD:
      return Object.assign({}, state, {
        loading: true,
        loaded: false,
        customerId: action.payload,
      });

    case actions.CUSTOMER_INFO_RESET:
      return Object.assign({}, state, {
        loading: false,
        loaded: false,
        customerId: null,
      });

    case actions.CUSTOMER_INFO_LOAD_FAIL:
      return Object.assign({}, state, { loaded: false, loading: false });

    case actions.CUSTOMER_INFO_LOAD_SUCCESS:

      // let canDoOrders = action.payload.customerInfo.authorizationMatrix.ORDER.GET;
      let canDoFlows = action.payload.customerInfo.authorizationMatrix.FLOW.GET;
      let canCreateOrders = action.payload.customerInfo.authorizationMatrix.ORDER.CREATE && action.payload.customerInfo.orderTypes && action.payload.customerInfo.orderTypes.length > 0;
      let canCreateFlows = action.payload.customerInfo.authorizationMatrix.FLOW.CREATE && action.payload.customerInfo.flowRegistrationTypes && action.payload.customerInfo.flowRegistrationTypes.length > 0;
      let contract = {
        ...state,
        places: {},
        authorization: {
          ...action.payload.customerInfo.authorizationMatrix,
          ACCESS: {
            ...action.payload.customerInfo.authorizationMatrix.ACCESS,
            // ORDERS: canCreateOrders,
            // CALENDAR: canCreateOrders,
            // FLOWS: canDoFlows,
          },
          ORDER: {
            ...action.payload.customerInfo.authorizationMatrix.ORDER,
            CREATE: canCreateOrders,
            UPDATE: canCreateOrders,
            QUERY_TEMPLATE: canCreateOrders
          },
          FLOW: {
            ...action.payload.customerInfo.authorizationMatrix.FLOW,
            QUERY: canDoFlows,
            CREATE: canCreateFlows,
            GET: canDoFlows,
            UPDATE: canDoFlows,
          },
          isAdmin: action.payload.isAdmin,
          isAgent: action.payload.isAgent,
          isEpsUser: action.payload.isEpsUser,
          canRelocate: action.payload.canRelocate,
          adminRoles: action.payload.adminRoles,
          useEmailActors: action.payload.useEmailActors,
        },
        defaults: {
          localCurrency: action.payload.customerInfo.defaults.localCurrency,
          // transport: '',
          depot: null,
        },
        restrictions: {
          ...state.restrictions,
          blankReceiptPossible: !!action.payload.customerInfo.blankReceiptPossible,
          deviationManagement: !!action.payload.customerInfo.deviationManagement,
          GS1LineRef: !!action.payload.customerInfo.GS1LineRef,
          useCcrValidation: !!action.payload.customerInfo.useCcrValidation,
          overruleMaxQty: !!action.payload.customerInfo.overruleMaxQty,
          palletExchange: !!action.payload.customerInfo.palletExchange,
          sealNumberRequired: !!action.payload.customerInfo.sealNumberRequired,
        },
        shipTos: Object.keys(action.payload.customerInfo.shipTos).map(id => {
          return {
            id,
            name: action.payload.customerInfo.shipTos[id]
          }
        }),
        orderTypes: action.payload.customerInfo.orderTypes.map(id => action.payload.definitions.order.type.find(t => t.id === id) || {id, name: id}),
        flowRegistrationTypes: action.payload.customerInfo.flowRegistrationTypes.map(id => action.payload.definitions.flow.type.find(t => t.id === id) || {id, name: id}),
        flowHandshakeTypes: action.payload.customerInfo.flowHandshakeTypes.map(id => action.payload.definitions.flow.type.find(t => t.id === id) || {id, name: id}),
        allFlowTypes: [],
        loaded: true,
        loading: false,
      };

      contract.orderTypes.sort(util.idSorter());
      contract.flowRegistrationTypes.sort(util.idSorter());
      contract.flowHandshakeTypes.sort(util.idSorter());

      // Remove duplicates
      let allFlowTypes = ([...contract.flowRegistrationTypes, ...contract.flowHandshakeTypes].reduce((res, type) => {
        return {
          ...res,
          [type.id]: type as Definition
        }
      }, {}));
      contract.allFlowTypes = Object.keys(allFlowTypes).map(key => allFlowTypes[key]); // Typescript doesn't have Object.values(...)

      if (action.payload.customerInfo.defaults.depot) {
        const { depot } = action.payload.customerInfo.defaults;
        const openingHours = depot.openingHours && JSON.parse(depot.openingHours);
        const address = JSON.parse(depot.address);

        const defaultDepot = {
          ...depot,
          ...address,
          default: true,
          isDepot: depot.type.toLocaleLowerCase() === 'depot',
          isLocation: false,
          isCustomer: false,
          openingHours: _.compact(_.flatten(openingHours && openingHours.length && openingHours[0]['Day']).map((day) => {
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
        };

        contract.places = {
          [defaultDepot.id]: defaultDepot,
        };
      }

      contract = Object.assign({}, contract, {
        authorization: {
          ...contract.authorization,
          FLOW: {
            ...contract.authorization.FLOW,
            MULTI_ACCEPT: true,
          },
        },
      });

      return contract;

    case actionsFromSelectCustomer.CLEAR_ACTIVE_CUSTOMER:
      return {
        ...state,
        authorization: {
          ...initialState.authorization,
          isAdmin: state.authorization.isAdmin,
          isAgent: state.authorization.isAgent,
          isEpsUser: state.authorization.isEpsUser,
          canRelocate: state.authorization.canRelocate,
          useEmailActors: state.authorization.useEmailActors,
          adminRoles: state.authorization.adminRoles,
        },
      };

    case actionsFromUserContext.USERCONTEXT_LOAD_SUCCESS:
      const userContextTO: UserContextTO = action.payload;
      return {
        ...state,
        authorization: {
          ...state.authorization,
          isAdmin: !!userContextTO.isAdmin,
          isAgent: !!userContextTO.isAgent,
          isEpsUser: userContextTO.userType === 'EpsUser',
          canRelocate: userContextTO.canRelocate,
          useEmailActors: userContextTO.useEmailActors,
          adminRoles: {
            updateEpsUser: userContextTO.isAgent || userContextTO.adminRoles.updateEpsUser,
            updateClientUser: userContextTO.isAgent || userContextTO.adminRoles.updateClientUser,
            createClientUser: userContextTO.isAgent || userContextTO.adminRoles.createClientUser,
            reInvite: userContextTO.isAgent || userContextTO.adminRoles.reInvite,
            inviteClientUser: userContextTO.isAgent || userContextTO.adminRoles.inviteClientUser,
            inviteEpsUser: userContextTO.isAgent || userContextTO.adminRoles.inviteEpsUser,
            resetPassword: userContextTO.isAgent || userContextTO.adminRoles.resetPassword,
          },

        }
      };
    default:
      return state;
  }
}
