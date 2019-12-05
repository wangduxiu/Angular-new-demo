import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseContainer } from 'app/modules/base/BaseContainer';
import { AzureMonitoringService } from 'app/core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import { Invoices } from '../../../core/model/Invoice.interface';
import { fadeInAnimation } from '../../../animations';

@Component({
  selector: 'app-descartes-invoices-page-container',
  templateUrl: './descartes-invoices-page-container.component.html',
  styleUrls: ['./descartes-invoices-page-container.component.less'],
  animations: [fadeInAnimation],
})
export class DescartesInvoicesPageContainer extends BaseContainer {

  url: string;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService) {
    super(store, azureMonitoringService);

    store.select('invoice').takeWhile(() => !this.destroyed).subscribe((invoice: Invoices) => {
      this.url = invoice.descartes.url;
    });
  }
}
