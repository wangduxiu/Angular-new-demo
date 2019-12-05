import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContractInfoTO } from 'app/core/store/contract-info/contract-info.interface';
import { Observable } from 'rxjs/Observable';
import { util } from '../../util/util';

import { default as cachedResponseEpsCusToIncoterm } from './responses/getContractInfo-EPS-CUS-to-incoterm';
import { default as cachedResponseMaterials } from './responses/getContractInfo-materials';
import { RestService } from './rest.service';

@Injectable()
export class ContractInfoRestService {

  private useMockRestData = false;

  constructor(private restService: RestService, private translate: TranslateService) {
  }

  getContractInfoOrderTypeToIncoterm(activeCustomerId: string, type: string, orderTypeId: string): Observable<ContractInfoTO> {
    if (this.useMockRestData) {
      const response = util.jsonDeepCopy(cachedResponseEpsCusToIncoterm);
      response.orderTypes[0].id = orderTypeId;
      return Observable.of(response).delay(1000);
    } else {
      this.restService.customerId = activeCustomerId;
      const body = {
        type,
        orderType: orderTypeId,
        date: util.formatDate(new Date()),
      };
      return this.restService.post<ContractInfoTO>(`/Contract/getContractInfo`, body).map(response => {
        return JSON.parse(response['_body']);
      });
    }
  }

  getContractInfoMaterials(activeCustomerId: string, type: string, orderTypeId: string, shippingCondition: string, fromId: string, toId: string, incoterm: string): Observable<ContractInfoTO> {
    if (this.useMockRestData) {
      const response = util.jsonDeepCopy(cachedResponseMaterials);
      response.orderTypes[0].id = orderTypeId;
      response.orderTypes[0].shippingConditions[0].shippingCondition = shippingCondition;
      response.orderTypes[0].shippingConditions[0].froms[0].id = fromId;
      response.orderTypes[0].shippingConditions[0].froms[0].tos[0].id = toId;
      response.orderTypes[0].shippingConditions[0].froms[0].tos[0].incoterms[0].incoterm = incoterm;
      return Observable.of(response).delay(1000);
    } else {
      this.restService.customerId = activeCustomerId;
      const body = {
        type,
        orderType: orderTypeId,
        date: util.formatDate(new Date()),
        shippingCondition: shippingCondition,
        fromId: fromId,
        toId: toId,
        incoterm: incoterm || '',
        // depth: 'string'
      };
      return this.restService.post<ContractInfoTO>(`/Contract/getContractInfo`, body).map(response => {
        return JSON.parse(response['_body']);
      });
    }
  }
}
