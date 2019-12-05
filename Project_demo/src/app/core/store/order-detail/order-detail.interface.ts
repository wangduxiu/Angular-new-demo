import { EditFlorderDetail, FlorderDetail, HasRecurrenceDates } from '../florder-detail/florder-detail.interface';

export interface EditOrderDetail extends EditFlorderDetail, HasRecurrenceDates {
  orderDetail: FlorderDetail;
  loadedEpp: number;
  maxEpp: number;
}

export interface RecurrenceDate {
  requestedDate: string,
  valid: boolean,
  createDate?: string,
  proposedDate?: string,
  proposedValid?: boolean,
  etmOrderNumber?: string,
  salesOrderNumber?: string,
  removed?: boolean,
  saving?: boolean,
}

export interface RecurrenceDates {
  recurrentOrderDates: RecurrenceDate[];
}

