import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { util } from '../../util/util';

@Injectable()
export class DocumentRestService {
  constructor(protected restService: RestService) {
  }

  getDocument(documentId: string, customerIds: string[]) {
    let url = `/Document/get?DocumentId=${documentId}`;
    if (customerIds && customerIds.length) {
      url += '&' + util.serializeObjectToParams({customerId: customerIds});
    }
    return this.restService.getBlobData(url);
  }

  getCCRDocument(ccrDocumentNumber: string) {
    return this.restService.getBlobData(`/Ccr/getCcrDocument?CcrNumber=${ccrDocumentNumber}`);
  }
}
