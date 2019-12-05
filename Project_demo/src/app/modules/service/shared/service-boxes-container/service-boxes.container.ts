import { Component, Input } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { BaseContainer } from 'app/modules/base/BaseContainer';
import { AzureMonitoringService } from '../../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../../core/store';
import { ContractDetails } from '../../../../core/store/contract-details/contract-details.interface';
import { fadeInAnimation } from '../../../../animations';

@Component({
  selector: 'app-service-boxes',
  templateUrl: './service-boxes.container.html',
  styleUrls: ['./service-boxes.container.less'],
  animations: [fadeInAnimation], // TODO FIRST check if possible in baseContainer
})
export class ServiceBoxesContainer extends BaseContainer {

  phoneNumber: string;
  emailAddress: string;

  @Input() hideFAQ: boolean = false;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService) {
    super(store, azureMonitoringService);

    store.select('contractDetails').takeWhile(() => !this.destroyed).subscribe((contractDetails: ContractDetails) => {
      this.phoneNumber = contractDetails.customerSummary.salesOrganisation.phoneNumber;
      this.emailAddress = contractDetails.customerSummary.salesOrganisation.emailAddress;
    });
  }

  openModule(path: string) {
    this.store.dispatch(go([path]));
  }
}
