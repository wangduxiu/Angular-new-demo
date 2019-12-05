import { CDFlorderType, FlorderTypeTO } from 'app/core/store/contract-details/contract-details.interface';

export enum ContractInfoLevel {NONE, ORDERTYPE, SHIPPING_CONDITION, FROM, TO, INCOTERM, MATERIALS}

export interface ContractInfo {
  loading: boolean;
  loaded: boolean;
  failed: boolean;
  error?: string;
  loadIds: string[];
  loadFromLevel: ContractInfoLevel;
  loadToLevel: ContractInfoLevel;
  orderTypes: CDFlorderType[];
  flowRegistrationTypes: CDFlorderType[];
  flowHandshakeTypes: CDFlorderType[];
  handshakes: Handshakes;
}

export interface ContractInfoTO {
  orderTypes: FlorderTypeTO[];
  handshakes: Handshakes;
}

export interface Handshakes {
  [key: string]: { // From-id
    [key: string]: true; // To-id, boolean is always true
  };
}
