import * as actions from './blank-receipts.actions';
import { initialState } from './blank-receipts.model';
import { BlankReceipt } from './blank-receipts.interface';

export function reducer(state = initialState, action: actions.Actions): BlankReceipt {
  switch (action.type) {
    case actions.BLANK_RECEIPT_CREATE: {
      return Object.assign({}, state, {
        saving: true,
        item: action.payload.blankReceipt,
      });
    }

    case actions.BLANK_RECEIPT_CREATE_SUCCESS: {
      return {
        saved: true,
        saving: false,
        item: null,
      };
    }

    case actions.BLANK_RECEIPT_CREATE_FAIL: {
      return {
        saved: false,
        saving: false,
        item: null,
      };
    }

    default: {
      return state;
    }
  }
}
