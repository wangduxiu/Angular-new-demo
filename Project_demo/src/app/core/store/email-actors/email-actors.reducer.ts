import * as actions from './email-actors.actions';
import { initialState } from './email-actors.model';
import { EmailActors } from './email-actors.interface';

export function reducer(state = initialState, action: actions.Actions): EmailActors {
  switch (action.type) {
    case actions.EMAIL_ACTORS_LOAD: {
      return Object.assign({}, state, {
        loading: true,
        saving: false,
        saved: false,
      });
    }

    case actions.EMAIL_ACTORS_LOAD_SUCCESS: {
      return {
        loaded: true,
        loading: false,
        saving: false,
        saved: false,
        items: action.payload,
      };
    }

    case actions.EMAIL_ACTORS_LOAD_FAIL: {
      return {
        loaded: false,
        loading: false,
        saving: false,
        saved: false,
        items: [],
      };
    }

    case actions.EMAIL_ACTORS_CREATE_OR_UPDATE: {
      return Object.assign({}, state, {
        saving: true,
        saved: false,
      });
    }

    case actions.EMAIL_ACTORS_CREATE_OR_UPDATE_SUCCESS: {
      return Object.assign({}, state, {
        saving: false,
        saved: true,
        items: state.items.find(item => item.id == action.payload.id) ? state.items.map(item => item.id == action.payload.id ? action.payload : item) : [...state.items, action.payload],
      });
    }

    case actions.EMAIL_ACTORS_CREATE_OR_UPDATE_FAIL: {
      return Object.assign({}, state, {
        saving: false,
        saved: false,
      });
    }

    case actions.EMAIL_ACTORS_DELETE_SUCCESS: {
      return Object.assign({}, state, {
        items: state.items.filter(item => item.id != action.payload.id),
      });
    }

    default: {
      return state;
    }
  }
}
