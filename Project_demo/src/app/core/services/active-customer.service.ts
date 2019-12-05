import { Injectable } from '@angular/core';
import { logger } from 'app/core/util/logger';
import { Customer } from '../store/user-context/user-context.interface';
import { ContractDetailsRestService } from './rest/contract-details.rest.service';

/**
 * Helper service to find customers with active contract.  Needed for debugging
 */
@Injectable()
export class ActiveCustomerService {

  constructor(private contractDetailsRestService: ContractDetailsRestService) {}

  checkActiveContract(customers: Customer[]) {

    const obs = customers.map(customer => this.contractDetailsRestService.getContractDetails(customer.id));

    let i = 0;

    const success = (res) => {
      logger.log(`OK: ${customers[i].id} ${customers[i].name}`);
      i += 1;
      obs.pop().subscribe(success, fail);
    };
    const fail = (res) => {
      logger.log(`NOK: ${customers[i].id} ${customers[i].name}`);
      i += 1;
      obs.pop().subscribe(success, fail);
    };

    obs.pop().subscribe(success, fail);

  }
}
