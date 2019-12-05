import { logger } from 'app/core/util/logger';
import { Definition } from './definition.interface';
import * as actions from './definitions.actions';
import { Definitions } from './definitions.interface';
import { initialState } from './definitions.model';

export function reducer(state = initialState, action: actions.Actions): Definitions {
  const prepareArray = (keyValueObject: { [key: string]: string }) => {
    if (keyValueObject == null) {
      logger.error('No key value object in definitions');
      return [];
    }
    const result = Object.keys(keyValueObject).map(key => {
      // check if name property is not an object
      // if it is, then get name property from this object
      const nameProperty = typeof keyValueObject[key] === 'object' ? keyValueObject[key]['name'] : keyValueObject[key];
      return { id: key, name: nameProperty, defaultValue: false };
    });
    // Mark first one as default
    if (result.length > 0) {
      result.splice(0, 1, Object.assign({}, result[0], { defaultValue: true }));
    }
    return result.sort((o1, o2) => o1.defaultValue ? -1 : o2.defaultValue ? 1 : o1.name > o2.name ? 1 : (o1.name < o2.name ? -1 : 0));
  };

  switch (action.type) {
    case actions.DEFINITIONS_LOAD_SUCCESS:
      return Object.assign({}, state, {
        flow: {
          status: prepareArray(action.payload.flowStatus),
          type: prepareArray(action.payload.orderType).filter((def: Definition) => ['CUS-CUS-DSMV', 'CUS-CUS-MOV'].indexOf(def.id) >= 0),
        },
        order: {
          status: prepareArray(action.payload.orderStatus),
          type: prepareArray(action.payload.orderType).filter((def: Definition) => ['CUS-CUS-DSMV', 'CUS-CUS-MOV'].indexOf(def.id) < 0),
          logisticsVarietyPacking: prepareArray(action.payload.logisticVarietyPacking),
          packingPerPallet: prepareArray(action.payload.packingsPerPallet),
          incoterm: prepareArray(action.payload.incoTerm).map(i => { return {id: i.id, name: i.id}}),
        },
        pallet: {
          type: prepareArray(action.payload.palletId),
        },
        packing: {
          type: prepareArray(action.payload.packingId),
          status: prepareArray(action.payload.packingStatus),
        },
        transport: {
          type: prepareArray(action.payload.transportType).filter(transportType => transportType.id.charAt(0) === 'Z'),
        },
        global: {
          type: prepareArray(action.payload.globalType),
          brick: prepareArray(action.payload.brick),
        },
        invoices: {
          invoiceTypes: prepareArray(action.payload.invoiceType),
        },
        places: prepareArray(action.payload.depot),
        loaded: true,
      });
    case actions.DEFINITIONS_LOAD_FAIL:
      return state;

    default:
      return state;
  }

}
