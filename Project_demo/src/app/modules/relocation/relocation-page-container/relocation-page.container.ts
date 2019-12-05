import { Component } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { RelocationSandbox } from 'app/core/sandboxes/relocation.sandbox';
import { fadeInAnimation } from '../../../animations';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import { Florder } from '../../../core/store/florders/florder.interface';
import { Florders } from '../../../core/store/florders/florders.interface';
import * as relocationsActions from '../../../core/store/relocations/relocations.actions';
import { UserContext } from '../../../core/store/user-context/user-context.interface';
import { util } from '../../../core/util/util';
import { FlorderPageContainer } from '../../florders/florder-page-container/florder-page.container';

@Component({
  selector: 'app-relocation-page',
  templateUrl: './relocation-page.container.html',
  styleUrls: ['../../florders/florder-page-container/florder-page.container.less'],
  animations: [fadeInAnimation],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelocationPageContainer extends FlorderPageContainer {
  relocations: Florders;
  userContext: UserContext;

  constructor(
    store: Store<fromRoot.RootState>,
    azureMonitoringService: AzureMonitoringService,
    private sandbox: RelocationSandbox
  ) {
    super(store, azureMonitoringService);
    store.select('relocations').takeWhile(() => !this.destroyed).subscribe((relocations: Florders) => {
      this.relocations = relocations;
      this.filter = util.deepCopy(relocations.filter); // We will change this object
      this.totalItems = relocations.totalItems;
      this.flordersAreLoading = relocations.loading;
    });
    store.select('session').takeWhile(() => !this.destroyed).subscribe((session: { userContext: UserContext }) => {
      this.userContext = session.userContext;
    });
  }

  protected reload(): void {
    this.store.dispatch(new relocationsActions.RelocationsLoadAction({ filter: this.filter }));
  }

  createFlorder(): void {
    if (this.authorization.canRelocate) {
      this.store.dispatch(go(['relocations/new', { back:'relocations' }]));
    }
  }

  copyRelocation(relocation: Florder): void {
    this.sandbox.copyRelocation(relocation.etmOrderNumber);
  }

  asTemplate(relocation: Florder): void {
    this.sandbox.createTemplateFromRelocation(relocation);
  }

  createTemplate(): void {
    if (this.authorization.canRelocate) {
      this.sandbox.createTemplate();
    }
  }

  openRelocation(florder: Florder): void {
    if (this.authorization.canRelocate) {
      this.store.dispatch(go([`relocations/${florder.etmOrderNumber}`, { salesOrderNumber: florder.salesOrderNumber, back: 'relocations' }]));
    }
  }

  gotoCalendar() {
    this.store.dispatch(go(['/calendar/relocation']));
  }
}
