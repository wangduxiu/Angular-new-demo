import { Definitions } from './definitions.interface';

export const initialState: Definitions = {
  flow: {
    status: [],
    type: [],
  },
  order: {
    status: [],
    type: [],
    logisticsVarietyPacking: [],
    packingPerPallet: [],
    incoterm: [],
  },
  pallet: {
    status: [],
    type: [],
  },
  packing: {
    status: [],
    type: [],
  },
  transport: {
    type: [],
  },
  global: {
    type: [],
    brick: [],
  },
  places: [],
  loaded: false,
  invoices: {
    invoiceTypes: []
  }
};
