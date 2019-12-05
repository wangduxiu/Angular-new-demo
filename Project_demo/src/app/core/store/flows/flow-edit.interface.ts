import { FormGroup } from '@angular/forms';
import { Florder } from '../florders/florder.interface';

export interface FlowEdit {
  etmOrderNumber: string;
  customerReferenceNumber: string;
  fromId: string;
  toId: string;
  comments: string;
  checked: boolean;
  collapsed: boolean;
  statusId: string;
  valid: boolean;
  formControl?: FormGroup;
  flow: Florder;
  items: {
    itemNumber: number;
    packingId: string;
    definitiveQuantity: string;
    originalQuantity: string;
    contentId: string;
    lineReferenceId: string;
  }[];
}
