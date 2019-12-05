import { Place } from '../florders/place.interface';

export interface BlankReceipt {
  saving: boolean;
  saved: boolean;
  item: BlankReceiptItem;
}

export interface BlankReceiptItem {
  type: string;
  quantity: number;
}
