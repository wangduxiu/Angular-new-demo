import { ContractInfo, ContractInfoLevel } from 'app/core/store/contract-info/contract-info.interface';

export const initialState: ContractInfo = {
  loadFromLevel: ContractInfoLevel.NONE,
  loadToLevel: ContractInfoLevel.NONE,
  loadIds: [],
  loading: false,
  loaded: false,
  failed: false,
  orderTypes: [],
  flowRegistrationTypes: [],
  flowHandshakeTypes: [],
  handshakes: {},
};
