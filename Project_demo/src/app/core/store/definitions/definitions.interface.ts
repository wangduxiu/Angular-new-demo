import { Definition } from './definition.interface';
import { Place } from '../florders/place.interface';

export interface Definitions {
  order: {
    status: Definition[],
    type: Definition[],
    logisticsVarietyPacking: Definition[],
    packingPerPallet: Definition[],
    incoterm: Definition[],
  };
  flow: {
    status: Definition[],
    type: Definition[],
  };
  pallet: {
    type: Definition[],
    status: Definition[],
  };
  packing: {
    type: Definition[],
    status: Definition[],
  };
  transport: {
    type: Definition[],
  };
  global: {
    type: Definition[],
    brick: Definition[],
  };
  invoices: {
    invoiceTypes: Definition[];
  };
  places: Place[];
  loaded: boolean;
}

export interface DefinitionsTO {
  country: { [key: string]: string };
  flowStatus: { [key: string]: string };
  invoiceType: { [key: string]: string };
  orderStatus: { [key: string]: string };
  orderType: { [key: string]: string };
  incoTerm: { [key: string]: string };
  packingId: { [key: string]: string };
  packingStatus: { [key: string]: string };
  palletId: { [key: string]: string };
  packingsPerPallet: { [key: string]: string };
  purchaseOrderType: { [key: string]: string };
  transportType: { [key: string]: string };
  globalType: { [key: string]: string };
  logisticVarietyPacking: { [key: string]: string };
  brick: { [key: string]: string };
  depot: { [key: string]: any };
}
