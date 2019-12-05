import {CustomerInfo} from 'app/core/store/customer-info/customer-info.interface';

export const initialState: CustomerInfo = {
  authorization: {
    isAdmin: false,
    isAgent: false,
    isEpsUser: false,
    canRelocate: false,
    useEmailActors: false,
    adminRoles: {
      updateEpsUser: false,
      inviteEpsUser: false,
      createClientUser: false,
      updateClientUser: false,
      inviteClientUser: false,
      resetPassword: false,
      reInvite: false,
    },
    ACCESS: {
      ORDERS: false,
      FLOWS: false,
      CALENDAR: false,
      INVOICES: false,
      STOCK: false,
      BLANK_RECEIPT: false,
      REPORTS: false,
    },
    FLOW: {
      QUERY: false,
      GET: false,
      CREATE: false,
      UPDATE: false,
      ACCEPT: false,
      OVERRULE_MAX: false,
      MULTI_ACCEPT: true,
    },
    INVOICES: {
      ACCESS: false,
      QUERY: false,
      LIST_INVOICES_AS_DOCUMENT: false,
      GET_INVOICE_DOCUMENT: false
    },
    ORDER: {
      QUERY: false,
      GET: false,
      CREATE: false,
      UPDATE: false,
      CANCEL: false,
      ACCEPT: false,
      QUERY_TEMPLATE: false,
      GET_TEMPLATE: false,
      CREATE_TEMPLATE: false,
      DELETE_TEMPLATE: false,
      GET_DELIVERY_DATES: false,
      CHECK_PALLET_FLOOR_QUANTITY: false,
      LIST_ORDERS_AS_DOCUMENT: false,
      OVERRULE_MAX: false
    },
    STOCK: {
      GET_CURRENT_STOCK_LIST: false
    }
  },
  loading: false,
  loaded: false,
  failed: false,
  customerId: null,
  defaults: {
    // transport: '',
    localCurrency: 'EUR',
    depot: null,
  },
  restrictions: {
    useCcrValidation: false,
    blankReceiptPossible: false,
    deviationManagement: false,
    overruleMaxQty: false,
    GS1LineRef: false,
    palletExchange: false,
    sealNumberRequired: false,
  },
  places: {},
  shipTos: [],
  flowHandshakeTypes: [],
  allFlowTypes: [],
  flowRegistrationTypes: [],
  orderTypes: [],
};
