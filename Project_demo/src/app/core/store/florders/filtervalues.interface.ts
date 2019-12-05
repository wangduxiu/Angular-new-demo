import { Definition } from 'app/core/store/definitions/definition.interface';
import { Place, PlaceTO } from 'app/core/store/florders/place.interface';

export interface FilterValuesTO {
  from: string[];
  to: string[];
  orderType: string[];
  shippingCondition: string[];
  incoTerm: string[];
  palletId: string[];
  packingId: string[];
  locations: PlaceTO[];
}

export interface FilterValues {
  loading: boolean;
  loaded: boolean;
  failed: boolean;
  customerId: string;
  customerIds: string[];
  froms: Definition[];
  tos: Definition[];
  orderTypes: Definition[];
  shippingConditions: Definition[];
  incoterms: Definition[];
  pallets: Definition[];
  packings: Definition[];
  locations: Place[];
}
