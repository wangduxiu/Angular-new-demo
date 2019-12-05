import { logger } from 'app/core/util/logger';
import * as actions from './users.actions';
import { EpsUsers } from './users.interface';
import { initialEpsUsers } from './users.model';

export function reducer(state = initialEpsUsers, action: actions.Actions): EpsUsers {
  switch (action.type) {
    case actions.EPS_USERS_FILTER_CLEAR: {
      return initialEpsUsers;
    }

    case actions.EPS_USERS_LOAD: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case actions.EPS_USERS_LOAD_SUCCESS: {
      const items = action.payload.items;
      return {
        loaded: true,
        loading: false,
        items,
        totalItems: action.payload.totalItems,
        pageNr: action.payload.pageNr || 1,
        pageSize: action.payload.pageSize,
        sortField: action.payload.sortField,
        sortAscending: action.payload.sortAscending,
      };
    }

    case actions.EPS_USERS_LOAD_FAIL: {
      try {
        const response = JSON.parse(action.payload._body);
        if (response.sapMessage.FunctionalError.standard.faultText === 'No orders found for given criteria') {
          return {
            loaded: true,
            loading: false,
            items: [],
            totalItems: 0,
            pageNr: undefined,
            pageSize: state.pageSize,
            sortField: state.sortField,
            sortAscending: state.sortAscending,
          };
        }
      } catch (e) {
        logger.error(e);
      }
      return state; // TODO handle errors
    }

    default: {
      return state;
    }
  }
}
