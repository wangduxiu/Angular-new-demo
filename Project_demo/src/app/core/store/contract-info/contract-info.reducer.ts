import { CDFlorderType, CDFrom, CDIncoterm, CDShippingCondition, CDTo, FlorderTypeTO } from 'app/core/store/contract-details/contract-details.interface';
import { mapFlorderTypes } from 'app/core/store/contract-details/map-florder-types';
import { Definitions } from 'app/core/store/definitions/definitions.interface';
import { Place } from 'app/core/store/florders/place.interface';
import { util } from 'app/core/util/util';
import * as customerInfoActions from '../customer-info/customer-info.actions';
import * as actions from './contract-info.actions';
import { ContractInfoLoadSuccessAction } from './contract-info.actions';
import { ContractInfo, ContractInfoLevel, ContractInfoTO } from './contract-info.interface';
import { initialState } from './contract-info.model';

function contractInfoLoad(state: ContractInfo, action: actions.ContractInfoLoadAction): ContractInfo {
  return {
    ...state,
    loading: true,
    loaded: false,
    failed: false,
    loadFromLevel: action.payload.from,
    loadToLevel: action.payload.to,
    loadIds: action.payload.ids,
  };
}

interface StartLevels {
  orderTypes: CDFlorderType[];
  orderType: CDFlorderType;
  shippingCondition: CDShippingCondition;
  from: CDFrom;
  to: CDTo;
  incoterm: CDIncoterm;
}

function generateAllFromAndAllTos(orderTypes: CDFlorderType[]) {
  orderTypes && orderTypes.forEach(orderType => {

    const shippingConditionZ1 = orderType.shippingConditions.find(sc => sc.id === 'Z1');

    // create all froms & all tos
    if (shippingConditionZ1 && shippingConditionZ1.froms) {
      // Create all for froms in incoterm
      const allFrom = {
        id: 'all',
        name: 'All',
        hidden: true,
        tos: [],
        isDefault: false
      };
      util.deepMerge(allFrom, ...shippingConditionZ1.froms);
      const indexOfAll = shippingConditionZ1.froms.findIndex(f => f.id === 'all');
      if (indexOfAll >= 0) {
        shippingConditionZ1.froms.splice(indexOfAll, 1);
      }
      shippingConditionZ1.froms.push(allFrom);

      // Create all for tos in all froms
      shippingConditionZ1.froms.forEach(from => {
        const allTo = {
          id: 'all',
          name: 'All',
          hidden: true,
          isDefault: false,
          clearing: false,
          incoterms: []
        };
        const indexOfAll = from.tos.findIndex(f => f.id === 'all');
        util.deepMerge(allTo, ...from.tos);
        if (indexOfAll >= 0) {
          from.tos.splice(indexOfAll, 1);
        }
        from.tos.push(allTo);
      });
    }
  });
}

/**
 * Get the 6 different levels for the given id's.  Only for present ID's, a level can be given
 * @param params
 */
function getLevels(params: { levelIds: string[], orderTypes: CDFlorderType[], flowHandshakeTypes: CDFlorderType[], flowRegistrationTypes: CDFlorderType[] }): StartLevels {
  const levelIds = [...params.levelIds];
  let orderTypes: CDFlorderType[] = null;
  let orderType: CDFlorderType = null;
  let shippingCondition: CDShippingCondition = null;
  let from: CDFrom = null;
  let to: CDTo = null;
  let incoterm: CDIncoterm = null;

  if (levelIds.length > 0) {
    const type = levelIds.splice(0, 1)[0];
    if (type === 'ORDER') {
      orderTypes = params.orderTypes;
    }
    if (type === 'FLOWH') {
      orderTypes = params.flowHandshakeTypes;
    }
    if (type === 'FLOWR') {
      orderTypes = params.flowRegistrationTypes;
    }
  }
  if (levelIds.length > 0) {
    const orderTypeId = levelIds.splice(0, 1)[0];
    orderType = orderTypes && orderTypes.find(ot => ot.id === orderTypeId);
  }
  if (levelIds.length > 0) {
    const shippingConditionId = levelIds.splice(0, 1)[0];
    shippingCondition = orderType && orderType.shippingConditions.find(sc => sc.id === (shippingConditionId || '-'));
  }

  if (levelIds.length > 0) { // fromId can be '' when Z1, then take 'all'
    const fromId = levelIds.splice(0, 1)[0] || 'all';
    from = shippingCondition && shippingCondition.froms.find(f => f.id === fromId);
  }
  if (levelIds.length > 0) { // toId can be '' when Z1, then take 'all'
    const toId = levelIds.splice(0, 1)[0] || 'all';
    to = from && from.tos.find(t => t.id === toId);
  }
  if (levelIds.length > 0) {
    const incotermId = levelIds.splice(0, 1)[0];
    incoterm = to && to.incoterms.find(i => i.id === (incotermId || '-'));
  }
  return {
    orderTypes,
    orderType,
    shippingCondition,
    from,
    to,
    incoterm
  };
}

function convertTO(orderTypeTOs: FlorderTypeTO[], definitions, locations: Place[]): CDFlorderType[] {
  return mapFlorderTypes(orderTypeTOs, definitions, locations);
}

/**
 * This function will take the current state containing the current contractInfo and the new contractInfo (part 1 or part 2) fetched from MW.
 * Now, the fetched part must be merged into (a copy of) the existing state.
 *
 * ContractInfo is fetched from MW in 3 parts:
 * - part 0 done by getCustomerInfo.  It fetches all orderTypes (and flow-specific types).  This merge method is not needed
 * - part 1 done by getContractInfo.  Request: type & orderType.  Result: shippingCondition - ... - incoterm. This must be merged in the state that only has part 0
 * - part 2 done by getContractInfo.  Request: type, orderType, shippingCondition, from, to, incoterm.  Result: all materials.
 *
 * The request-IDs are stored in the state too (property loadIds).  These IDs are needed to know where to do the merge.
 * Lastly, the loadFromLevel is also stored in the state, identifying the level on which new data is requested with getContractInfo.
 *
 * The getLevels method will return the objects referred to by the loadIds.
 * When done, this 'mergeOrderTypes' method will know where to put which level of the new loaded data (newLevels) in the existing (copy of) state in the right level (currentLevels)
 *
 * @param state currentState
 * @param payload
 *     contractInfo : transfer-object from MW containing the new loaded (part 1 or part 2) data of the contract
 *     definitions & locations: needed to replace certain data with definitions (when to-object is converted into orderDetail object)
 *     type
 *       FLOWH: flowTypes for handshake activities (update flow)
 *       FLOWR: flowTypes for registration activities (create or edit flow)
 *       ORDER: orderTypes for order activities
 */
function mergeOrderTypes({ state, payload }: { state: ContractInfo, payload: { contractInfo: ContractInfoTO; definitions: Definitions, locations: Place[], type: 'FLOWH' | 'FLOWR' | 'ORDER' } }) {
  const resultState = util.jsonDeepCopy(state);
  // generateAllFromAndAllTos(result.orderTypes);
  const currentLevels = getLevels({
    levelIds: resultState.loadIds,
    orderTypes: resultState.orderTypes,
    flowHandshakeTypes: resultState.flowHandshakeTypes,
    flowRegistrationTypes: resultState.flowRegistrationTypes,
  });
  const convertedFlorderTypes = convertTO(payload.contractInfo.orderTypes, payload.definitions, payload.locations); // Contains all (requested) orderTypes
  generateAllFromAndAllTos(convertedFlorderTypes);
  const newLevels = getLevels({
    levelIds: resultState.loadIds,
    orderTypes: convertedFlorderTypes,
    flowHandshakeTypes: convertedFlorderTypes,
    flowRegistrationTypes: convertedFlorderTypes,
  });

  // Remove what will be loaded
  switch (resultState.loadFromLevel) {
    case ContractInfoLevel.NONE:
      // Not completely correct, but not applicable
      resultState.orderTypes = [];
      resultState.flowRegistrationTypes = [];
      break;
    case ContractInfoLevel.ORDERTYPE:
      // Find the index of the orderType that needs to be switched with the new loaded orderType
      let index;
      if (payload.type === 'ORDER') {
        index = resultState.orderTypes.findIndex(ot => ot.id === currentLevels.orderType.id);
      } else if (payload.type === 'FLOWR') {
        index = resultState.flowRegistrationTypes.findIndex(ot => ot.id === currentLevels.orderType.id);
      } else if (payload.type === 'FLOWH') {
        index = resultState.flowHandshakeTypes.findIndex(ot => ot.id === currentLevels.orderType.id);
      }
      // switch them
      currentLevels.orderTypes.splice(index, 1, newLevels.orderType);
      break;
    case ContractInfoLevel.SHIPPING_CONDITION: // Not applicable at the moment
      currentLevels.orderType.shippingConditions = currentLevels.orderType.shippingConditions.map(sc => {
        if (currentLevels.shippingCondition && sc.id === currentLevels.shippingCondition.id) {
          return newLevels.shippingCondition;
        } else {
          return sc;
        }
      });
      break;
    case ContractInfoLevel.FROM: // Not applicable at the moment
      currentLevels.shippingCondition.froms = currentLevels.shippingCondition.froms.map(f => {
        if (currentLevels.from && f.id === currentLevels.from.id) {
          return newLevels.from;
        } else {
          return f;
        }
      });
      break;
    case ContractInfoLevel.TO: // Not applicable at the moment
      currentLevels.from.tos = currentLevels.from.tos.map(to => {
        if (currentLevels.to && to.id === currentLevels.to.id) {
          return newLevels.to;
        } else {
          return to;
        }
      });
      break;
    case ContractInfoLevel.INCOTERM:
      currentLevels.to.incoterms = currentLevels.to.incoterms.map(i => {
        if (currentLevels.incoterm && i.id === currentLevels.incoterm.id) {
          return newLevels.incoterm;
        } else {
          return i;
        }
      });
      break;
  }
  return resultState;
}

function contractInfoLoadSuccess(state: ContractInfo, action: actions.ContractInfoLoadSuccessAction): ContractInfo {
  const result = {
    ...mergeOrderTypes({
      state,
      payload: action.payload
    }),
    handshakes: action.payload.contractInfo.handshakes,
    loading: false,
    loaded: true,
    failed: false,
  };

  return result;
}

function contractInfoLoadFail(state: ContractInfo, action: actions.ContractInfoLoadFailAction): ContractInfo {
  return {
    ...state,
    loading: false,
    loaded: false,
    failed: true,
    error: action.payload.error,
  };
}

function customerInfoLoadSuccess(state: ContractInfo, action: customerInfoActions.CustomerInfoLoadSuccessAction) {
  const flowRegistrationTypeIds = action.payload.customerInfo.flowRegistrationTypes || action.payload.definitions.flow.type.map(t => t.id);
  const flowHandshakeTypeIds = action.payload.customerInfo.flowHandshakeTypes || action.payload.definitions.flow.type.map(t => t.id);
  const orderTypeIds = action.payload.customerInfo.orderTypes;
  const contract = {
    ...state,
    orderTypes: orderTypeIds.map(id => {
      return {
        ...action.payload.definitions.order.type.find(t => t.id === id) || {
          id,
          name: id
        },
        shippingConditions: [],
      };
    }),
    flowRegistrationTypes: flowRegistrationTypeIds.map(id => {
      return {
        ...action.payload.definitions.flow.type.find(t => t.id === id) || {
          id,
          name: id
        },
        shippingConditions: [],
      };
    }),
    flowHandshakeTypes: flowHandshakeTypeIds.map(id => {
      return {
        ...action.payload.definitions.flow.type.find(t => t.id === id) || {
          id,
          name: id
        },
        shippingConditions: [],
      };
    }),
  };

  contract.orderTypes.sort(util.idSorter());
  contract.flowRegistrationTypes.sort(util.idSorter());
  contract.flowHandshakeTypes.sort(util.idSorter());

  return contract;
}

/*
const xxxmanipulateAction = function (action: ContractInfoLoadSuccessAction): ContractInfoLoadSuccessAction {
  if (action.payload.contractInfo.orderTypes) {
    const newAction = JSON.parse(JSON.stringify(action));
    const epsCus = newAction.payload.contractInfo.orderTypes.find(ot => ot.id === 'EPS-CUS');
    const cusEps = newAction.payload.contractInfo.orderTypes.find(ot => ot.id === 'CUS-EPS');

    if (epsCus && epsCus.shippingConditions && epsCus.shippingConditions.length) {
      const epsCusZ1 = epsCus.shippingConditions.find(sc => sc.shippingCondition === 'Z1');
      // eliminate some Tos
      epsCusZ1.froms.forEach((from, fromIndex) => {
        if (from.tos.length > 1) {
          from.tos.splice((fromIndex % from.tos.length), 1);
        }
      });
      debugger;
    }

    if (cusEps && cusEps.shippingConditions && cusEps.shippingConditions.length) {
      const cusEpsZ1 = cusEps.shippingConditions.find(sc => sc.shippingCondition === 'Z1');
      // eliminate some Tos
      cusEpsZ1.froms.forEach((from, fromIndex) => {
        if (from.tos.length > 1) {
          from.tos.splice((fromIndex % from.tos.length), 1);
        }
      });
      debugger;
    }
    return newAction;
  }
  return action;
};

*/
export function reducer(
  state = initialState,
  action: actions.Actions | customerInfoActions.Actions,
): ContractInfo {
  switch (action.type) {
    case actions.CONTRACT_INFO_LOAD:
      return contractInfoLoad(state, action);

    case actions.CONTRACT_INFO_LOAD_SUCCESS:
      // action = manipulateAction(action);
      return contractInfoLoadSuccess(state, action);

    case actions.CONTRACT_INFO_LOAD_FAIL:
      return contractInfoLoadFail(state, action);

    case customerInfoActions.CUSTOMER_INFO_LOAD_SUCCESS:
      return customerInfoLoadSuccess(state, action);

    default:
      return state;
  }
}
