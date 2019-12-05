import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { AbstractEffects } from '../AbstractEffects';
import { TranslateService } from '@ngx-translate/core';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';

@Injectable()
export class AzureLogEffects extends AbstractEffects {

  constructor(azureMonitoringService: AzureMonitoringService, private actions$: Actions, translateService: TranslateService) {
    super(translateService, azureMonitoringService);
  }

  @Effect({ dispatch: false })
  logAction$: Observable<{}> = this.actions$
    .switchMap(action => {
      if (action.type) {
        this.azureMonitoringService.logEvent(action.type);
      }
      return Observable.of({});
    });
}
