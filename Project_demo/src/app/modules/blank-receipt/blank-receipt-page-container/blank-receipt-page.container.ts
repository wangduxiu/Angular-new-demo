import { Component } from '@angular/core';
import { BaseContainer } from '../../base/BaseContainer';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/store';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import { BlankReceipt } from '../../../core/store/blank-receipts/blank-receipts.interface';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { Definition } from '../../../core/store/definitions/definition.interface';
import * as actions from '../../../core/store/blank-receipts/blank-receipts.actions';
import { fadeInAnimation } from '../../../animations';

@Component({
  selector: 'app-blank-receipt-page',
  templateUrl: './blank-receipt-page.container.html',
  styleUrls: ['./blank-receipt-page.container.less'],
  animations: [fadeInAnimation],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlankReceiptPageContainer extends BaseContainer {

  blankReceipt: BlankReceipt;
  globalTypes: Definition[];

  isSaving: boolean = false;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService) {
    super(store, azureMonitoringService);

    store.select('definitions').takeWhile(() => !this.destroyed).subscribe((definitions: Definitions) => {
      this.globalTypes = definitions.global.type;
    });

    store.select('blankReceipts').takeWhile(() => !this.destroyed).subscribe((blankReceipt: BlankReceipt) => {
      this.blankReceipt = blankReceipt;
      this.isSaving = blankReceipt.saving;
    });
  }

  createBlankReceipts({ value }) {
    this.store.dispatch(new actions.BlankReceiptCreateAction({ blankReceipt: value }));
  }
}
