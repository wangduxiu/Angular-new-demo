import { initialStateFlordersFilter } from './florders-filter.model';
import { Florders } from './florders.interface';

export const initialState: Florders = {
  items: [],
  filter: initialStateFlordersFilter,
  loading: false,
  loaded: false,
  downloading: false,
  totalItems: null,
  filterValues: {
    loading: false,
    loaded: false,
    failed: false,
    customerId: null,
    customerIds: [],
    froms: [],
    incoterms: [],
    orderTypes: [],
    packings: [],
    pallets: [],
    tos: [],
    shippingConditions: [],
    locations: [],
  }
};
