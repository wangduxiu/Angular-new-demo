import { Injectable } from '@angular/core';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../app.settings';
import { CustomerSummaryMW } from '../../store/customer-summary/customer-summary.interface';
import { CustomersTO } from '../../store/user-context/user-context.interface';
import { default as cachedCustomers } from './responses/searchCustomers';
import { RestService } from './rest.service';

@Injectable()
export class CustomersRestService {

  constructor(private restService: RestService) {
  }

  getSoldTosForSalesOrganisation(salesOrganisationId: string): Observable<CustomersTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getUserContext');
      return Observable.of(cachedCustomers as CustomersTO);
    } else {
      return this.restService.get(`/Customer/searchCustomer?SalesOrganization=${salesOrganisationId}`);
    }
  }

  getShipTosForSoldTo(soldToId: string): Observable<CustomersTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getUserContext');
      return Observable.of(cachedCustomers as CustomersTO);
    } else {
      return this.restService.get(`/Customer/searchCustomer?CustomerNumber=${soldToId}`);
    }
  }

  getCustomerSummary(activeCustomerId: string): Observable<CustomerSummaryMW> {
    this.restService.customerId = activeCustomerId;
    return this.restService.get<CustomerSummaryMW>(`/Customer/getCustomerSummary?CustomerId=${activeCustomerId}`);
  }
}

