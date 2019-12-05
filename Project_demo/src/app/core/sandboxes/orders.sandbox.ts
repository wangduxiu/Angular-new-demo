import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {AbstractSandbox} from 'app/core/sandboxes/abstract.sandbox';
import * as ordersActions from 'app/core/store/orders/orders.actions';
import 'rxjs/add/operator/delay';
import {Observable} from 'rxjs/Observable';
import {AzureMonitoringService} from '../services/AzureMonitoringService';
import * as fromRoot from '../store';
import {FilterValuesService} from '../services/filter-values.service';

@Injectable()
export class OrdersSandbox extends AbstractSandbox {

  constructor(
    store: Store<fromRoot.RootState>,
    translateService: TranslateService,
    azureMonitoringService: AzureMonitoringService,
    private filterValuesService: FilterValuesService,
  ) {
    super(store, translateService, azureMonitoringService);
  }

  resetOrdersFilterValues(): void {
    this.store.dispatch(new ordersActions.OrdersFilterValuesResetAction());
  }

  loadOrdersFilterValues(): Observable<void> {
    return this.filterValuesService.loadOrdersFilterValues(this.handleFail);
  }
}
