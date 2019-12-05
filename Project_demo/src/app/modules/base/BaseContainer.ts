import { OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/takeWhile';
import { AzureMonitoringService } from '../../core/services/AzureMonitoringService';
import { AuthorizationMatrix } from '../../core/store/contract-details/contract-details.interface';
import * as fromRoot from '../../core/store/index';

let idCounter = 0;

export class BaseContainer implements OnDestroy {

  protected id = 0;

  protected destroyed: boolean = false;

  authorization: AuthorizationMatrix;

  constructor(protected store: Store<fromRoot.RootState>, private azureMonitoringService: AzureMonitoringService) {
    this.id = ++idCounter; // tslint:disable-line
    this.logNavigation();
    this.store
      .map(state => state.customerInfo.authorization)
      .distinctUntilChanged()
      .takeWhile(() => !this.destroyed)
      .subscribe(authorization => this.authorization = authorization);
  }

  private logNavigation() {
    this.azureMonitoringService.logPageView();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
//    logger.log(`Container ${this.id} destroyed`);
  }
}
