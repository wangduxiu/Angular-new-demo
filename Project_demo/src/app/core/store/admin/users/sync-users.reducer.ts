import * as actions from './users.actions';
import { initialSyncWithAD } from './users.model';
import { SyncWithAD } from './users.interface';

export function reducer(state = initialSyncWithAD, action: actions.Actions): SyncWithAD {
  switch (action.type) {
    case actions.USERS_SYNC_WITH_AD: {
      return Object.assign({}, state, {syncing: true, error: null, success: false})
    }
    case actions.USERS_SYNC_WITH_AD_SUCCESS: {
      return Object.assign({}, state, {syncing: false, error: null, success: true})
    }
    case actions.USERS_SYNC_WITH_AD_FAIL: {
      return Object.assign({}, state, {syncing: false, error: action.payload, success: false})
    }
    default: {
      return state;
    }
  }
}
