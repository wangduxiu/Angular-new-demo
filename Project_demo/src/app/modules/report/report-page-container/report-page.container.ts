import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { fadeInAnimation } from '../../../animations';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import { Place } from '../../../core/store/florders/place.interface';
import * as actions from '../../../core/store/stock/stock.actions';
import { Stock } from '../../../core/store/stock/stock.interface';
import { BaseContainer } from '../../base/BaseContainer';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.container.html',
  styleUrls: ['./report-page.container.less'],
  animations: [fadeInAnimation],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPageContainer extends BaseContainer {

  //tabs
  selectedTab: number = 0;

  locations: Place[] = [];
  location: Place;
  places: { [key:string]: Place };

  stock: Stock;
  totalItems: number;
  isLoading: boolean = false;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService) {
    super(store, azureMonitoringService);

    store.takeWhile(() => !this.destroyed).map(state => state.customerInfo).distinctUntilChanged().subscribe(customerInfo => {
      const places = customerInfo.shipTos;
      if (places) {
        this.locations = places.map(place => {
          return {
            id: place.id,
            name: place.name,
          }
        });
      }
    });

    store.select('stock').takeWhile(() => !this.destroyed).subscribe((stock: Stock) => {
      this.stock = stock;
      this.totalItems = stock.totalItems;
      this.isLoading = stock.loading;
      this.location = stock.location;
    });
  }

  filterStock({ value }) {
    this.store.dispatch(new actions.StockLoadAction({ filter: value }));
  }
}
