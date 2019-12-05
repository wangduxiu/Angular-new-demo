import { FilterValues } from 'app/core/store/florders/filtervalues.interface';
import { Florder, FlorderTO } from './florder.interface';
import { FlordersFilter } from './florders-filter.interface';

// TODO we can abstract this => EntityList<T> and use it for all collections
export interface Florders { // TODO split up in Flow & order
  items: Florder[];
  filter: FlordersFilter;
  loading: boolean;
  loaded: boolean;
  downloading: boolean;
  totalItems: number;
  handshaking?: boolean;
  handshaked?: boolean;
  filterValues: FilterValues;
}
export interface FlordersTO { // TODO split up in Flow & order
  items: FlorderTO[];
  totalItems: number;
}
