import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../core/store';
import { CustomerSummary } from '../../../../core/store/customer-summary/customer-summary.interface';

@Component({
  selector: 'app-dashboard-tile-latest-orders',
  templateUrl: './tile-latest-orders.html',
  styleUrls: ['../common/tile-latest-florders.less', '../common/dashboard-tile.less']
})
export class LatestOrdersTile implements OnInit, OnDestroy {

  @Output() viewAll = new EventEmitter<void>();
  @Output() view = new EventEmitter<{ etmOrderNumber: string, salesOrderNumber: string }>(); // etmOrderNumber

  protected destroyed: boolean = false;
  customerSummary: CustomerSummary;

  constructor(protected store: Store<fromRoot.RootState>) {
    this.store.select(state => state.contractDetails.customerSummary)
      .takeWhile(() => !this.destroyed)
      .subscribe((customerSummary: CustomerSummary) => {
        this.customerSummary = customerSummary;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  viewOrder(etmOrderNumber: string) {
    const order = this.customerSummary.latestOrders.find(o => o.etmOrderNumber === etmOrderNumber);
    this.view.emit({ etmOrderNumber: order.etmOrderNumber, salesOrderNumber: order.salesOrderNumber });
  }

  latestThree(): string[] {
    const latestOrders: string[] = this.customerSummary.latestOrders.map(value => value.etmOrderNumber);
    if (latestOrders.length > 3) {
      latestOrders.splice(latestOrders.length - 2, latestOrders.length);
    }
    return latestOrders;
  }

}
