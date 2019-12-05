import * as actions from './select-customer.actions';
import * as userContextActions from '../user-context/user-context.actions';

export function reducer(state = null, action: actions.Actions
  | userContextActions.Actions): {id: string, name: string} {

  switch (action.type) {
    case actions.SET_ACTIVE_CUSTOMER:
      return action.payload;
    case actions.CLEAR_ACTIVE_CUSTOMER:
      return {
        id: null, name: null,
      };
    case userContextActions.USERCONTEXT_LOAD_SUCCESS:
      return {
        ...state,
        id: action.payload.activeCustomerId,
        name: action.payload.activeCustomerName,
      };
    default:
      return state;
  }
}
