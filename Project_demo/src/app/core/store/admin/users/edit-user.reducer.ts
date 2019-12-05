import { util } from '../../../util/util';
import * as actions from './users.actions';
import { EditUser } from './users.interface';
import { initialClientUser, initialEditUser, initialEpsUser } from './users.model';

export function reducer(state = initialEditUser, action: actions.Actions): EditUser {
  switch (action.type) {

    case actions.START_INVITE_CLIENT_USER: {
      return Object.assign({}, state, {
        isInvitation: true,
        isCreate: false,
        user: util.deepCopy(initialClientUser),
      })
    }
    case actions.START_CREATE_CLIENT_USER: {
      return Object.assign({}, state, {
        isInvitation: false,
        isCreate: true,
        user: util.deepCopy(initialClientUser),
      })
    }
    case actions.START_INVITE_EPS_USER: {
      return Object.assign({}, state, {
        isInvitation: true,
        isCreate: false,
        user: util.deepCopy(initialEpsUser),
      })
    }
    case actions.START_CREATE_EPS_USER: {
      return Object.assign({}, state, {
        isInvitation: false,
        isCreate: true,
        user: util.deepCopy(initialEpsUser),
      })
    }
    case actions.EPS_USER_LOAD:
    case actions.CLIENT_USER_LOAD: {
      return Object.assign({}, state, {
        loading: true
      })
    }
    case actions.EPS_USER_LOAD_SUCCESS:
    case actions.CLIENT_USER_LOAD_SUCCESS: {
      return Object.assign({}, state, {
        loading: false,
        loadSuccess: true,
        isInvitation: false,
        isCreate: false,
        user: action.payload
      })
    }
    case actions.CLIENT_USER_UPDATE:
    case actions.CLIENT_USER_CREATE:
    case actions.CLIENT_USER_INVITE_UPDATE:
    case actions.EPS_USER_UPDATE:
    case actions.EPS_USER_CREATE:
    case actions.EPS_USER_INVITE_UPDATE: {
      return Object.assign({}, state, {
        user: action.payload,
        saving: true,
        saveSuccess: false
      });
    }
    case actions.CLIENT_USER_UPDATE_SUCCESS:
    case actions.CLIENT_USER_CREATE_SUCCESS:
    case actions.CLIENT_USER_INVITE_UPDATE_SUCCESS:
    case actions.EPS_USER_UPDATE_SUCCESS:
    case actions.EPS_USER_CREATE_SUCCESS:
    case actions.EPS_USER_INVITE_UPDATE_SUCCESS: {
      return Object.assign({}, state, {
        saving: false,
        saveSuccess: true
      });
    }
    case actions.CLIENT_USER_UPDATE_FAIL:
    case actions.CLIENT_USER_CREATE_FAIL:
    case actions.CLIENT_USER_INVITE_UPDATE_FAIL:
    case actions.EPS_USER_UPDATE_FAIL:
    case actions.EPS_USER_CREATE_FAIL:
    case actions.EPS_USER_INVITE_UPDATE_FAIL: {
      return Object.assign({}, state, {
        saving: false,
        saveSuccess: false
      });
    }

    case actions.CLIENT_USER_LOAD_SOLDTOS: {
      return {
        ...state,
        loading: true,
        soldTosOfSalesOrganisation: []
      }
    }

    case actions.CLIENT_USER_LOAD_SOLDTOS_SUCCESS: {
      return {
        ...state,
        soldTosOfSalesOrganisation: action.payload.soldTos,
        loading: false
      }
    }

    case actions.CLIENT_USER_LOAD_SOLDTOS_FAIL: {
      return {
        ...state,
        soldTosOfSalesOrganisation: [],
        loading: false
      }
    }

    case actions.CLIENT_USER_LOAD_SHIPTOS: {
      return {
        ...state,
        loading: true,
        shipTosOfSoldTo: []
      }
    }

    case actions.CLIENT_USER_LOAD_SHIPTOS_SUCCESS: {
      return {
        ...state,
        shipTosOfSoldTo: action.payload.shipTos,
        loading: false
      }
    }

    case actions.CLIENT_USER_LOAD_SHIPTOS_FAIL: {
      return {
        ...state,
        shipTosOfSoldTo: [],
        loading: false
      }
    }

    case actions.USER_RE_INVITE: {
      return Object.assign({}, state, {
        reInviting: true,
        reInviteSuccess: false
      });
    }

    case actions.USER_RE_INVITE_SUCCESS: {
      return Object.assign({}, state, {
        reInviting: false,
        reInviteSuccess: true
      });
    }

    case actions.USER_RE_INVITE_FAIL: {
      return Object.assign({}, state, {
        reInviting: false,
        reInviteSuccess: false
      });
    }

    case actions.USER_RESET_PASSWORD: {
      return Object.assign({}, state, {
        resettingPassword: true,
        resetPasswordSuccess: false
      });
    }

    case actions.USER_RESET_PASSWORD_SUCCESS: {
      return Object.assign({}, state, {
        resettingPassword: false,
        resetPasswordSuccess: true
      });
    }

    case actions.USER_RESET_PASSWORD_FAIL: {
      return Object.assign({}, state, {
        resettingPassword: false,
        resetPasswordSuccess: false
      });
    }

    default: {
      return state;
    }
  }
}
