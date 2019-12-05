import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';
import * as actions from './config.actions';
import { RootState } from '../index';

@Injectable()
export class ConfigEffects {

  constructor(private store: Store<RootState>, private azureMonitoringService: AzureMonitoringService, private actions$: Actions) {
  }

  @Effect({ dispatch: false })
  initializeAzureMonitoringService: Observable<Action>
    = this.actions$
    .ofType(actions.CONFIG_GET)
    .withLatestFrom(this.store, (action, state) => {
      return { ...state.config };
    })
    .switchMap(({ instrumentationKey, verboseLogging }) => {
        this.azureMonitoringService.init(instrumentationKey, verboseLogging);
        return Observable.of(null);
      }
    );
}
