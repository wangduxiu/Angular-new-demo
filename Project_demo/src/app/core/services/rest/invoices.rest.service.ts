import { Injectable } from '@angular/core';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../app.settings';
import { InvoiceFilter, InvoicesFromMW } from '../../model/Invoice.interface';
import { util } from '../../util/util';
import { default as mocked } from './responses/getInvoices';
import { RestService } from './rest.service';

@Injectable()
export class InvoicesRestService {
  constructor(private restService: RestService) {
  }

  private getQueryParams(filter: InvoiceFilter) {
    const newParamsObject = {
      SoldTo: filter.soldTo !== 'all' && filter.soldTo || null,
      InvoiceNumber: filter.invoiceNumber,
      Type: filter.type,
      InvoiceDateFrom: filter.invoiceDateFrom,
      InvoiceDateTo: filter.invoiceDateTo,
      NetAmountFrom: filter.netAmountFrom,
      NetAmountTo: filter.netAmountTo,
      Currency: filter.currency,

      PageNumber: filter.pageNr,
      PageSize: filter.pageSize,
      sortingColumn: filter.sortField,
      sortingType: filter.sortAscending ? 'asc' : 'desc'
    };
    return util.serializeObjectToParams(newParamsObject);
  }

  getInvoices(filter: InvoiceFilter): Observable<InvoicesFromMW> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getInvoices');
      return Observable.of(mocked as InvoicesFromMW);
    } else {
      if (filter != null) {
        const params = this.getQueryParams(filter);
        return this.restService.get(`/Invoice/query?${params}`);
      }
      return this.restService.get('/Invoice/query');
    }
  }

  getInvoiceAsDocument(invoiceNumber: string) {
    return this.restService.getBlobData(`/Invoice/getInvoiceDocument?InvoiceNumber=${invoiceNumber}`);
  }

  getInvoicesAsList(filter: InvoiceFilter) {
    if (filter != null) {
      const params = this.getQueryParams({
        ...filter,
        pageNr: 1,
        pageSize: 999999
      });
      return this.restService.getBlobData(`/Invoice/listInvoicesAsDocument?${params}`);
    }
    return this.restService.getBlobData('/Invoice/listInvoicesAsDocument');
  }

  getExternalUrl() {
    return this.restService.get('/Invoice/getExternalUrl');
  }

}
