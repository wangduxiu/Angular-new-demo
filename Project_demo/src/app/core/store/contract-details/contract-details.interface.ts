import {AdminRoles} from 'app/core/store/user-context/user-context.interface';
import {CustomerSummary, CustomerSummaryMW} from '../customer-summary/customer-summary.interface';
import {Definition} from '../definitions/definition.interface';
import {Place, PlaceTO} from '../florders/place.interface';

export interface CDOpeningHours {
  weekdayNr: number;
  slots: { from: string, to: string }[];
}

export interface CDShippingCondition {
  id: string;
  name: string;
  froms: CDFrom[];
}

export interface CDFlorderType extends Definition {
  id: string;
  name?: string;
  shippingConditions: CDShippingCondition[];
}

export interface CDFrom {
  id: string;
  from?: any;
  openingHours?: CDOpeningHours[];
  tos: CDTo[];
  isDefault: boolean;
  hidden: boolean;
}

export interface CDTo {
  id: string;
  to?: any;
  openingHours?: CDOpeningHours[];
  isDefault: boolean;
  hidden: boolean;
  clearing: boolean;
  frequency?: 'T' | 'W' | 'D'; // Only for flows T = transactional, W = weekly, D = daily
  incoterms: CDIncoterm[];
  wholesaler?: {
    mandatory: boolean;
    wholesalers: Definition[];
  };
  poNumber?: {
    required: boolean;
    unique: boolean;
    mask: string;
    example: string;
  };
}

export interface MaterialTypes {
  combination: {
    palletIds: CDPalletId[];
  };
  packings: CDPackingId[];
  pallets: CDPackingId[];
}

export interface CDIncoterm extends MaterialTypes{
  id: string;
  name: string;
  isDefault: boolean;
}

export interface CDPackingId {
  id: string;
  name?: string;
  packingStatusses: CDPackingStatus[];
}

export interface CDPalletId {
  id: string;
  name?: string;
  packingIds: CDPackingId[];
}

export interface CDPackingStatus extends Definition {
  id: string;
  name?: string;
  logisticsVarietyPackings: CDLogisticsVarietyPacking[];
}

export interface CDLogisticsVarietyPacking {
  id: string;
  name?: string;
  packingsPerPallets: Definition[];
}

export interface ContractRestrictions {
  blankReceiptPossible: boolean;
  deviationManagement: boolean;
  GS1LineRef: boolean;
  useCcrValidation: boolean;
  overruleMaxQty: boolean;
  palletExchange: boolean;
  sealNumberRequired: boolean;
}

export interface ContractDetails {
  authorization: AuthorizationMatrix;
  loading: boolean;
  loaded: boolean;
  activeCustomerId: string;
  defaults: {
    transport: string;
    localCurrency: string;
  };
  restrictions: ContractRestrictions;
  orderTypes: CDFlorderType[];
  orderTypesLoading: boolean;
  orderTypesLoaded: boolean;
  flowRegistrationTypes: CDFlorderType[]; // Used for creating flows
  flowHandshakeTypes: CDFlorderType[];       // Used for creating flow handshakes
  allFlowTypes: CDFlorderType[];        // Used for filtering on flows & guard to check if flow edit can start (flow edit used for edits & handshakings)
  flowTypesLoading: boolean;
  flowTypesLoaded: boolean;
  places: { [key: string]: Place };
  customerSummary: CustomerSummary;
  handshakes: HandshakesOfContractDetails;
  locations?: [any];
}

export interface FlorderTypeTO {
  id?: string;
  name?: string;
  shippingConditions: {
    shippingCondition: string;
    froms: {
    id: string;
      tos: {
      id: string;
        clearing?: boolean;
        frequency?: string; // only for flows
        wholesaler?: {
          mandatory: boolean;
          wholesalers: Definition[];
        };
        incoterms: {
          incoterm: string;
          combination?: {
            palletIds: {
              id: string;
              name: string;
              packingIds: {
                id: string;
                name: string;
                packingStatusses: {
                  id: string;
                  name: string;
                  logisticsVarietyPackings: {
                    id: string;
                    name: string;
                    packingsPerPallets: {
                      id: string;
                      name: string;
                    }
                  }[]
                }[]
              }[]
            }[]
          };
          packings?: {
            id: string;
            name: string;
            packingStatusses?: {
              id: string;
              name: string;
              logisticsVarietyPackings: {
                id: string;
                name: string;
                packingsPerPallets: {
                  id: string;
                  name: string;
                };
              }[];
            }[];
          }[];
          pallets?: {
            id: string;
            name: string;
          }[],
        }[];
        poNumber?: {
          required: boolean;
          unique: boolean;
          mask?: string;
          example?: string;
        };
       }[];
    }[];
  }[];
}

export interface AuthorizationMatrix extends AuthorizationMatrixTO {
  isAdmin: boolean;
  isAgent: boolean;
  isEpsUser: boolean;
  canRelocate: boolean;
  useEmailActors: boolean;
  adminRoles: AdminRoles;
}

export interface AuthorizationMatrixTO {
  ACCESS: {
    ORDERS: boolean;
    FLOWS: boolean;
    CALENDAR: boolean;
    INVOICES: boolean;
    STOCK: boolean;
    BLANK_RECEIPT: boolean;
    REPORTS: boolean;
  };
  FLOW: {
    QUERY: boolean;
    GET: boolean;
    CREATE: boolean;
    UPDATE: boolean;
    ACCEPT: boolean;
    OVERRULE_MAX: boolean;
    MULTI_ACCEPT?: boolean;
  };
  INVOICES: {
    ACCESS: boolean;
    QUERY: boolean;
    LIST_INVOICES_AS_DOCUMENT: boolean;
    GET_INVOICE_DOCUMENT: boolean;
  };
  ORDER: {
    QUERY: boolean;
    GET: boolean;
    CREATE: boolean;
    UPDATE: boolean;
    CANCEL: boolean;
    ACCEPT: boolean;
    QUERY_TEMPLATE: boolean;
    GET_TEMPLATE: boolean;
    CREATE_TEMPLATE: boolean;
    DELETE_TEMPLATE: boolean;
    GET_DELIVERY_DATES: boolean;
    CHECK_PALLET_FLOOR_QUANTITY: boolean;
    LIST_ORDERS_AS_DOCUMENT: boolean;
    OVERRULE_MAX: boolean;
  };
  STOCK: {
    GET_CURRENT_STOCK_LIST: boolean;
  };
}

export interface ContractDetailsTO {
  authorizationMatrix: AuthorizationMatrixTO;
  defaults: {
    transport: string,
    localCurrency: string
  };
  restrictions: {
    blankReceiptPossible: boolean,
    deviationManagement: boolean,
    GS1LineRef: boolean,
    useCcrValidation: boolean,
    overruleMaxQty: boolean,
    palletExchange: boolean,
  };
  orderTypes: FlorderTypeTO[];
  flowTypes: FlorderTypeTO[];
  flowHandshakeTypes: FlorderTypeTO[];
  locations: {
    [key: string]: PlaceTO;
  };
  customerSummary: CustomerSummaryMW;
  handshakes: HandshakesOfContractDetails;
}

interface HandshakesOfContractDetails {
  [key: string]: { // From-id
    [key: string]: true; // To-id, boolean is always true
  };
}
