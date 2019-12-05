import * as actions from './invitation-dates.actions';
import { initialState } from './invitation-dates.model';
import { InvitationDates } from './invitation-dates.interface';

const prepareArray = (keyValueObject: { [key: string]: string }) => {
  let result = Object.keys(keyValueObject).map(key => {
    return { id: key, name: keyValueObject[key] };
  });
  return result.sort((o1, o2) =>  (o1.name < o2.name ? -1 : 1));
}

export function reducer(state = initialState, action: actions.Actions): InvitationDates {

  switch (action.type) {
    case actions.ADMIN_INVITATION_DATES_LOAD_CLIENT:
      return Object.assign({}, state, {
        ...state,
        clientUserInvitationDate: {
          loading: true,
          loaded: false,
          date: null
        }
      });

    case actions.ADMIN_INVITATION_DATES_LOAD_EPS:
      return Object.assign({}, state, {
        ...state,
        epsUserInvitationDate: {
          loading: true,
          loaded: false,
          date: null
        }
      });

    case actions.ADMIN_INVITATION_DATES_LOAD_CLIENT_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        clientUserInvitationDate: {
          loading: false,
          loaded: true,
          date: action.payload
        }
      });

    case actions.ADMIN_INVITATION_DATES_LOAD_EPS_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        epsUserInvitationDate: {
          loading: false,
          loaded: true,
          date: action.payload
        }
      });

    case actions.ADMIN_INVITATION_DATES_LOAD_CLIENT_FAIL:
      return Object.assign({}, state, {
        ...state,
        clientUserInvitationDate: {
          loading: false,
          loaded: false,
          date: null
        }
      });

    case actions.ADMIN_INVITATION_DATES_LOAD_EPS_FAIL:
      return Object.assign({}, state, {
        ...state,
        epsUserInvitationDate: {
          loading: false,
          loaded: false,
          date: null
        }
      });

    case actions.ADMIN_INVITATION_DATES_SAVE_CLIENT:
      return Object.assign({}, state, {
        ...state,
        clientUserInvitationDate: {
          ...state.clientUserInvitationDate,
          saving: true,
          saved: false
        }
      });

    case actions.ADMIN_INVITATION_DATES_SAVE_EPS:
      return Object.assign({}, state, {
        ...state,
        epsUserInvitationDate: {
          ...state.epsUserInvitationDate,
          saving: true,
          saved: false
        }
      });

    case actions.ADMIN_INVITATION_DATES_SAVE_CLIENT_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        clientUserInvitationDate: {
          ...state.clientUserInvitationDate,
          saving: false,
          saved: true
        }
      });

    case actions.ADMIN_INVITATION_DATES_SAVE_EPS_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        epsUserInvitationDate: {
          ...state.epsUserInvitationDate,
          saving: false,
          saved: true
        }
      });

    case actions.ADMIN_INVITATION_DATES_SAVE_CLIENT_FAIL:
      return Object.assign({}, state, {
        ...state,
        clientUserInvitationDate: {
          ...state.clientUserInvitationDate,
          saving: false,
          saved: false
        }
      });

    case actions.ADMIN_INVITATION_DATES_SAVE_EPS_FAIL:
      return Object.assign({}, state, {
        ...state,
        epsUserInvitationDate: {
          ...state.epsUserInvitationDate,
          saving: false,
          saved: false
        }
      });

    default:
      return state;

  }

}
