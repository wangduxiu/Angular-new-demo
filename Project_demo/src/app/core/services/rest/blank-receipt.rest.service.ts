import { Injectable } from '@angular/core';
import { BlankReceiptItem } from '../../store/blank-receipts/blank-receipts.interface';
import { util } from '../../util/util';
import { RestService } from './rest.service';

@Injectable()
export class BlankReceiptRestService {
  constructor(private restService: RestService) {
  }

  createBlankReceipt(blankReceiptItem: BlankReceiptItem) {
    const params = this.getQueryParams({}, blankReceiptItem);
    return this.restService.getBlobData(`/Receipt/createBlankReceipts?${params}`);
  }

  private getQueryParams(params: any, blankReceiptItem: BlankReceiptItem) {
    const newParamsObject = {
      ...params,
      Type: blankReceiptItem.type,
      Quantity: blankReceiptItem.quantity,
    };
    return util.serializeObjectToParams(newParamsObject);
  }
}
