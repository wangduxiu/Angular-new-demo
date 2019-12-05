import { Component, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/store';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { AbstractCalendarFlorderTooltipContainer } from './abstract-calendar-florder-tooltip.container';
import * as relocationDetailActions from '../../../core/store/relocation-detail/relocation-detail.actions';

@Component({
  selector: 'app-calendar-relocation-tooltip',
  templateUrl: './calendar-relocation-tooltip.container.html',
  styleUrls: ['./calendar-florder-tooltip.container.less'],
})
export class CalendarRelocationTooltipContainer extends AbstractCalendarFlorderTooltipContainer {

  relocationDetail: FlorderDetail;
  private loadedEtmOrderNrForTooltip: string;

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
      .map(state => state.editRelocationDetail.relocationDetail)
      .distinctUntilChanged()
      .subscribe(relocationDetail => {
        this.relocationDetail = relocationDetail;
        this.loadedEtmOrderNrForTooltip = relocationDetail && relocationDetail.etmOrderNumber || null;
      });
  }

  protected loadFlorder() {
    if (this.loadedEtmOrderNrForTooltip !== this.florderInfo.etmOrderNumber) {
      this.loadedEtmOrderNrForTooltip = this.florderInfo.etmOrderNumber;
      this.store.dispatch(new relocationDetailActions.RelocationDetailOpen({
        etmOrderNumber: this.florderInfo.etmOrderNumber,
        salesOrderNumber: this.florderInfo.salesOrderNumber,
      }));
    }
  }
}
