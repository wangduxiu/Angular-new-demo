import * as actions from './service.actions';
import { initialState } from './service.model';
import { Service } from './service.interface';

export function reducer(state = initialState, action: actions.Actions): Service {
  switch (action.type) {
    case actions.CONTACT_SEND_MESSAGE: {
      return Object.assign({}, state, {
        contact: Object.assign({}, state, {
          saving: true,
          saveSuccess: null,
        }),
      });
    }

    case actions.CONTACT_SEND_MESSAGE_SUCCESS: {
      return Object.assign({}, state, {
        contact: Object.assign({}, state, {
          saving: false,
          saveSuccess: true,
        }),
      });
    }

    case actions.CONTACT_SEND_MESSAGE_FAIL: {
      return Object.assign({}, state, {
        contact: Object.assign({}, state, {
          saving: false,
          saveSuccess: false,
        }),
      });
    }

    default: {
      return state;
    }
  }
}
