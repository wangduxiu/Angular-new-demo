import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/store';
import { FlowRestService } from '../../../core/services/rest/flow.rest.service';
import { util } from '../../../core/util/util';
import { 
  FlowDetailCheckFlowDateAction as CheckFlowDate,
  FlowDetailCheckFlowDateSuccessAction as CheckFlowDateSuccess, 
  FlowDetailCheckFlowDateErrorAction as CheckFlowDateError } from '../../../core/store/flow-detail/flow-detail.actions';

interface ValidationParams {
  frequency: 'T' | 'W' | 'D';
  fromId: string;
  toId: string;
}

interface RestCallParams extends ValidationParams{
  flowWeek: string;
  value: string;
}

interface AsyncValidationFunction {
  (c: FormControl): Observable<any>;
}
@Injectable()
export class FlowDateAsyncValidator {

  private restCall: Observable<any>;
  private previousParams: RestCallParams;
  private store: Store<fromRoot.RootState>;

  constructor(store: Store<fromRoot.RootState>, private flowRestService: FlowRestService) {
    this.store = store;
  }

  private getRestCall(params: RestCallParams): Observable<any> {
    if (!this.previousParams
      || this.previousParams.frequency !== params.frequency
      || this.previousParams.fromId !== params.fromId
      || this.previousParams.toId !== params.toId
      || this.previousParams.flowWeek !== params.flowWeek
      || this.previousParams.value !== params.value
    ) {
      if (this.restCall) {
        this.restCall.take(0);
      }

      this.store.dispatch(new CheckFlowDate({
        value: params.value,
        frequency: params.frequency,
        fromId: params.fromId,
        toId: params.toId,
        flowWeek: params.flowWeek,
      }));

      this.previousParams = params;

      return Observable.of(null);
    }
    return Observable.of(null);
  }

  validateFlowDate(params: ValidationParams): AsyncValidationFunction {
    return (c: FormControl) => {
      if (!c.value) {
        return Observable.of({ invalid: true });
      }
      let flowWeek;
      if (params.frequency === 'W') {
        flowWeek = {
          weekNumber: util.getWeekNumber(util.parseDateString(c.value)),
          year: util.parseDateString(c.value).year,
        };
      }
      return this.getRestCall({ ...params, flowWeek, value: c.value });
    };
  }
}
