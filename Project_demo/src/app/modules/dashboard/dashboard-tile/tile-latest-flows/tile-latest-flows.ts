import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../core/store';
import { CustomerSummary } from '../../../../core/store/customer-summary/customer-summary.interface';

@Component({
  selector: 'app-dashboard-tile-latest-flows',
  templateUrl: './tile-latest-flows.html',
  styleUrls: ['./tile-latest-flows.less', '../common/tile-latest-florders.less', '../dashboard-tile.less']
})
export class LatestFlowsTile implements OnInit, OnDestroy {

  @Output() viewHandshakes = new EventEmitter<void>();
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

  viewFlow(etmOrderNumber: string) {
    const flow = this.customerSummary.latestFlows.find(o => o.etmOrderNumber === etmOrderNumber);
    this.view.emit({ etmOrderNumber: flow.etmOrderNumber, salesOrderNumber: flow.salesOrderNumber });
  }

  latestThree(): string[] {
    const latestFlows: string[] = this.customerSummary.latestFlows.map(value => value.etmOrderNumber);
    if (latestFlows.length > 3) {
      latestFlows.splice(latestFlows.length - 2, latestFlows.length);
    }
    return latestFlows;
  }
}
