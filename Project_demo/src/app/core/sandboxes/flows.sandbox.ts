import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {AbstractSandbox} from 'app/core/sandboxes/abstract.sandbox';
import * as flowsActions from 'app/core/store/flows/flows.actions';
import 'rxjs/add/operator/delay';
import {Observable} from 'rxjs/Observable';
import {AzureMonitoringService} from '../services/AzureMonitoringService';
import * as fromRoot from '../store';
import {FilterValuesService} from '../services/filter-values.service';

@Injectable()
export class FlowsSandbox extends AbstractSandbox {

  constructor(
    store: Store<fromRoot.RootState>,
    translateService: TranslateService,
    azureMonitoringService: AzureMonitoringService,
    private filterValuesService: FilterValuesService,
  ) {
    super(store, translateService, azureMonitoringService);
  }

  resetFlowsFilterValues(): void {
    this.store.dispatch(new flowsActions.FlowsFilterValuesResetAction());
  }

  loadFlowsFilterValues(): Observable<void> {
    return this.filterValuesService.loadFlowsFilterValues(this.handleFail);
  }
}
