import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { AdalService } from '../../services/adal/adal.service';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';
import { DefinitionRestService } from '../../services/rest/definition.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import { DEFINITIONS_LOAD, DefinitionsLoadAction, DefinitionsLoadFailAction, DefinitionsLoadSuccessAction } from './definitions.actions';

@Injectable()
export class DefinitionsEffects extends AbstractEffects {

  constructor(azureMonitoringService: AzureMonitoringService, private actions$: Actions, private definitionRestService: DefinitionRestService, translateService: TranslateService, private adalService: AdalService) {
    super(translateService, azureMonitoringService);
  }

  @Effect()
  loadDefinitions$: Observable<Action>
    = this.actions$
          .ofType(DEFINITIONS_LOAD)
          .filter(action => this.adalService.isAuthenticated)
          .switchMap(action =>
            this.definitionRestService.getDefinitions(action.payload.language)
                .map(orderArray => new DefinitionsLoadSuccessAction(orderArray))
                .catch((err) => this.handleFail(err, 'Get definitions', [
                  Observable.of(new DefinitionsLoadFailAction(err))
                ])
                )
          );
}
