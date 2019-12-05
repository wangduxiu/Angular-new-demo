import * as actions from './admin-definitions.actions';
import { AdminDefinitions } from './admin-definitions.interface';
import { initialState } from './admin-definitions.model';

const prepareArray = (keyValueObject: { [key: string]: string }) => {
  let result = Object.keys(keyValueObject).map(key => {
    return { id: key, name: keyValueObject[key] };
  });
  return result.sort((o1, o2) =>  (o1.name < o2.name ? -1 : 1));
}

export function reducer(state = initialState, action: actions.Actions): AdminDefinitions {

  switch (action.type) {
    case actions.ADMIN_DEFINITIONS_LOAD_SUCCESS:

      return Object.assign({}, state, {
        loaded: true,
        salesOrganisation: prepareArray(action.payload.adminDefinitions.salesOrganisation),
        customer: Object.keys(action.payload.adminDefinitions.customer).map(key => action.payload.adminDefinitions.customer[key]),
        role: prepareArray(action.payload.roles),
        language: prepareArray(action.payload.adminDefinitions.language),
      });
    case actions.ADMIN_DEFINITIONS_LOAD_FAIL:
      return state;

    default:
      return state;

  }

}
