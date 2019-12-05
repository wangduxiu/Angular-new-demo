import { Injectable } from '@angular/core';
import { RestService } from 'app/core/services/rest/rest.service';
import { FilterValuesTO } from 'app/core/store/florders/filtervalues.interface';
import { Observable } from 'rxjs/Observable';
import { util } from '../../util/util';

@Injectable()
export class FilterValuesRestService {

  constructor(private restService: RestService){}

  getOrderFilterValues(activeCustomerId: string, customerIds: string[]): Observable<FilterValuesTO>{
    this.restService.customerId = activeCustomerId;
    let url = '/Order/getFilterValues';
    if (customerIds && customerIds.length) {
      url += '?' + util.serializeObjectToParams({customerId: customerIds});
    }
    return this.restService.get<FilterValuesTO>(url);
  }

  getFlowFilterValues(activeCustomerId: string): Observable<FilterValuesTO>{
    this.restService.customerId = activeCustomerId;
    return this.restService.get<FilterValuesTO>('/Flow/getFilterValues');
  }

}
