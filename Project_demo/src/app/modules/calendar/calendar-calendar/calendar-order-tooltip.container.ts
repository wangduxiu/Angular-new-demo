import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/store';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import * as orderDetailActions from '../../../core/store/order-detail/order-detail.actions';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { AbstractCalendarFlorderTooltipContainer } from './abstract-calendar-florder-tooltip.container';

@Component({
  selector: 'app-calendar-order-tooltip',
  templateUrl: './calendar-order-tooltip.container.html',
  styleUrls: ['./calendar-florder-tooltip.container.less'],
})
export class CalendarOrderTooltipContainer extends AbstractCalendarFlorderTooltipContainer {

  orderDetail: FlorderDetail;
  private loadedEtmOrderNrForTooltip: string;
  private loadedSalesOrderNrForTooltip: string;

  constructor(
    store: Store<fromRoot.RootState>,
    azureMonitoringService: AzureMonitoringService,
    host: ElementRef
  ) {
    super(store, azureMonitoringService, host);
  }

  protected getFlorderFromStore() {
    this.store
      .takeWhile(() => !this.destroyed)
      .map(state => state.editOrderDetail.orderDetail)
      .distinctUntilChanged()
      .subscribe(orderDetail => {
        this.orderDetail = orderDetail;
        this.loadedEtmOrderNrForTooltip = orderDetail && orderDetail.etmOrderNumber || null;
        this.loadedSalesOrderNrForTooltip = orderDetail && orderDetail.salesOrderNumber || null;
      });
  }

  protected loadFlorder() {
    if (this.loadedEtmOrderNrForTooltip !== this.florderInfo.etmOrderNumber || this.loadedSalesOrderNrForTooltip !== this.florderInfo.salesOrderNumber) {
      this.loadedEtmOrderNrForTooltip = this.florderInfo.etmOrderNumber;
      this.store.dispatch(new orderDetailActions.OrderDetailOpen({
        etmOrderNumber: this.florderInfo.etmOrderNumber,
        salesOrderNumber: this.florderInfo.salesOrderNumber,
        customerIds: []
      })); // TODO fix if cr127 (transporter) can access calendar
    }
  }
}
