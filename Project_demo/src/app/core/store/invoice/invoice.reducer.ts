import * as actions from './invoice.actions';
import { Invoice, InvoiceFromMW, Invoices } from '../../model/Invoice.interface';
import { AppSettings } from '../../../app.settings';

const initialState: Invoices = {
  loading: false,
  loaded: false,
  downloading: false,
  items: [],
  totalItems: null,
  filter: {
    type: '',
    pageSize: AppSettings.PAGE_SIZE,
    pageNr: 1,
    sortField: 'invoiceDate',
    sortAscending: false,
    soldTo: 'all',
    currency: ['EUR'],
    invoiceDateFrom: null,
    invoiceDateTo: null,
    invoiceNumber: null,
    localCurrency: null,
    netAmountFrom: null,
    netAmountTo: null,
    euro: null
  },
  descartes: {
    url: '',
    loading: false,
    loadSuccess: false,
  }
};

const mwToFeMapper = (invoiceFromMW: InvoiceFromMW):Invoice => {
  return { // If different, can be mapped here
    ...invoiceFromMW
  };
};

export function reducer(state = initialState, action: actions.Actions): Invoices {

  switch (action.type) {
    case actions.QUERY_INVOICES_START:
      return Object.assign({}, state, {
        loaded: false,
        loading: true,
        filter: action.payload.filter,
        items: [],
        totalItems: null
      });
    case actions.QUERY_INVOICES_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        items: action.payload.invoices.items.map(mwToFeMapper),
        totalItems: action.payload.invoices.totalItems
      });
    case actions.CLEAR_INVOICES_FILTER:
    case actions.QUERY_INVOICES_FAIL:
      return Object.assign({}, initialState);

    case actions.INVOICE_DOWNLOAD: {
      return Object.assign({}, state, { downloading: true });
    }

    case actions.INVOICE_DOWNLOAD_SUCCESS: {
      return Object.assign({}, state, { downloading: false });
    }

    case actions.INVOICE_DOWNLOAD_FAIL: {
      return Object.assign({}, state, { downloading: false });
    }

    case actions.INVOICE_DOWNLOAD_LIST: {
      return Object.assign({}, state, { downloading: true });
    }

    case actions.INVOICE_DOWNLOAD_LIST_SUCCESS: {
      return Object.assign({}, state, { downloading: false });
    }

    case actions.INVOICE_DOWNLOAD_LIST_FAIL: {
      return Object.assign({}, state, { downloading: false });
    }

    case actions.DESCARTES_INVOICES_URL_LOAD: {
      return Object.assign({}, state, {
        descartes: {
          url: null,
          loading: true,
          loadSuccess: false,
        }
      });
    }

    case actions.DESCARTES_INVOICES_URL_LOAD_SUCCESS: {
      return Object.assign({}, state, {
        descartes: {
          url: action.payload.url,
          loading: false,
          loadSuccess: true,
        }
      });
    }

    case actions.DESCARTES_INVOICES_URL_LOAD_FAIL: {
      return Object.assign({}, state, {
        descartes: {
          url: null,
          loading: false,
          loadSuccess: false,
        }
      });
    }

    default:
      return state;

  }

}
