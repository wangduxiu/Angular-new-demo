import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CustomerInfoTO } from 'app/core/store/customer-info/customer-info.interface';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../app.settings';
import { ContractDetailsTO } from '../../store/contract-details/contract-details.interface';
import { util } from '../../util/util';

import { default as cachedResponse } from './responses/getContractDetails-new';
import { default as getCustomerInfoResult } from './responses/getCustomerInfo';
import { RestService } from './rest.service';

interface ValidatePoNumberParams {
  poNumber: string;
  required: boolean;
  unique: boolean;
  mask: string;
  senderRefNumber: string;
  fromId: string;
  toId: string;
  etmOrderNumber: string;
}

interface ValidatePoNumberFailResponse {
  Origin: string;
  Type: string;
  Message: string;
}

@Injectable()
export class ContractDetailsRestService {

  constructor(private restService: RestService, private translate: TranslateService) {
  }

  getContractDetails(activeCustomerId: string): Observable<ContractDetailsTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getContractDetails');
      return Observable.of(cachedResponse as ContractDetailsTO);
    } else {
      this.restService.customerId = activeCustomerId;
      return this.restService.get<ContractDetailsTO>(`/Customer/getContractDetails?date=${util.formatDate(new Date())}&CustomerId=${activeCustomerId}`);
    }
  }


  /**
   *
   *
   * Return values:
   * {  "success": true  }
   * or not according to mask
   * { "Origin":"SAP","Type":"FUNCTIONAL","Message":"Functional SAP Error: Reference does not match mask","SubMessages":[] }
   * or required
   * {"Origin":"SAP","Type":"FUNCTIONAL","Message":"Functional SAP Error: Reference must be filled","SubMessages":[]}
   * or unique
   * ???????????????
   *
   * @param {ValidatePoNumberParams} params
   * @returns {Observable<boolean>}
   */
  validatePoNumber(params: ValidatePoNumberParams): Observable<{success: boolean, message: string}> {
    return this.restService.post<any>('/Contract/validatePoNumber', params)
               .switchMap((response: any) => {
                 let result = JSON.parse(response._body);
                 return Observable.of(result);
               })
               .catch((error: Error) => {
                 const errorMessage = util.getErrorMessage(error);
                 return Observable.of({success: false, message: errorMessage.message});
               });
  }

  getCustomerInfo(activeCustomerId: string): Observable<CustomerInfoTO> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getCustomerInfo');
      return Observable.of(getCustomerInfoResult as CustomerInfoTO);
    } else {
      this.restService.customerId = activeCustomerId;
      return this.restService.get<CustomerInfoTO>(`/Customer/getCustomerInfo?date=${util.formatDate(new Date())}&CustomerId=${activeCustomerId}`);
    }
  }

}
