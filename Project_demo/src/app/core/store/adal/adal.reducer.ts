import * as actions from './adal.actions';
import { initialAdal } from './adal.model';
import { Adal } from './adal.interface';

export function reducer(state = initialAdal, action: actions.Actions): Adal {

  switch (action.type) {
    case actions.ADAL_LOGIN_FAILURE:
      return state;
    case actions.ADAL_LOGIN_SUCCESS:
      return Object.assign({}, state, action.payload);
    default:
      return state;

  }

}
