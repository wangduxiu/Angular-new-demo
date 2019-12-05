import { logger } from 'app/core/util/logger';
import * as actions from './users.actions';
import { ClientUsers } from './users.interface';
import { initialClientUsers } from './users.model';

export function reducer(state = initialClientUsers, action: actions.Actions): ClientUsers {
  switch (action.type) {
    case actions.CLIENT_USERS_FILTER_CLEAR: {
      return initialClientUsers;
    }

    case actions.CLIENT_USERS_LOAD: {
      return Object.assign({}, state, {
        loading: true,
      });
    }

    case actions.CLIENT_USERS_LOAD_SUCCESS: {
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
        bulk: state.bulk,
      };
    }

    case actions.CLIENT_USERS_LOAD_FAIL: {
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
            bulk: state.bulk,
          };
        }
      } catch (e) {
        logger.error(e);
      }
      return state;
    }


    // BULK

    case actions.CLIENT_USER_BULK_UPLOAD: {
      return {
        ...state,
        bulk: {
          inProgress: true,
          finished: false,
        }
      };
    }

    case actions.CLIENT_USER_BULK_UPLOAD_RESPONSE: {
      return {
        ...state,
        bulk: {
          inProgress: false,
          finished: true,
        }
      };
    }

    case actions.CLIENT_USER_BULK_UPLOAD_FAIL: {
      return {
        ...state,
        bulk: {
          inProgress: false,
          finished: false,
        }
      };
    }

    case actions.CLIENT_USER_BULK_DOWNLOAD_EXAMPLE: {
      return {
        ...state,
        bulk: {
          inProgress: true,
          finished: state.bulk.finished,
        }
      };
    }

    case actions.CLIENT_USER_BULK_DOWNLOAD_EXAMPLE_SUCCESS: {
      return {
        ...state,
        bulk: {
          inProgress: false,
          finished: state.bulk.finished,
        }
      };
    }

    case actions.CLIENT_USER_BULK_DOWNLOAD_EXAMPLE_FAIL: {
      return {
        ...state,
        bulk: {
          inProgress: false,
          finished: state.bulk.finished,
        }
      };
    }

    default: {
      return state;
    }
  }
}
