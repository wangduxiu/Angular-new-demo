import { EditOrderDetail } from './order-detail.interface';
import { initialStateEditFlorderDetail, initialStateFlorderDetail } from '../florder-detail/florder-detail.model';

export const initialStateEditOrderDetail: EditOrderDetail = Object.assign({}, initialStateEditFlorderDetail, {
  orderDetail: initialStateFlorderDetail,
  loadedEpp: null,
  maxEpp: null,
  recurrenceDates: null
});
