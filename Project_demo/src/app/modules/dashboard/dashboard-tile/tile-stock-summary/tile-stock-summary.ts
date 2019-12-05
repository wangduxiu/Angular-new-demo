import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../core/store';
import { CustomerSummary } from '../../../../core/store/customer-summary/customer-summary.interface';

@Component({
  selector: 'app-dashboard-tile-stock-summary',
  templateUrl: './tile-stock-summary.html',
  styleUrls: ['./tile-stock-summary.less', '../common/dashboard-tile.less', '../common/tile-latest-florders.less']
})
export class StockSummaryTile implements OnInit, OnDestroy {

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

  calculateBarWidth(amount: number) {
    const maxAmount: number = Math.max(Math.abs(this.customerSummary.stockOverview.packingAmount), Math.abs(this.customerSummary.stockOverview.palletAmount));
    return Math.abs(amount) / maxAmount * 100;
  }

}
