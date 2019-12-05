import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import {RootState} from '../';
import {AzureMonitoringService} from '../../services/AzureMonitoringService';
import {RelocationRestService} from '../../services/rest/relocation.rest.service';
import {AbstractEffects} from '../AbstractEffects';
import * as actions from './relocations.actions';

@Injectable()
export class RelocationsEffects extends AbstractEffects {

  constructor(private store: Store<RootState>, azureMonitoringService: AzureMonitoringService, private actions$: Actions, private relocationRestService: RelocationRestService, translateService: TranslateService) {
    super(translateService, azureMonitoringService);
  }

  @Effect()
  loadRelocations$: Observable<Action>
    = this.actions$.ofType(actions.RELOCATIONS_LOAD).debounceTime(50) // Avoid double click
    .withLatestFrom(this.store, (action, state) => {
      return {state};
    }).switchMap(({state}) =>
      this.relocationRestService.getRelocations(state.relocations.filter)
        .map(relocations =>
          new actions.RelocationsLoadSuccessAction(
            {
              relocations,
              definitions: state.definitions,
              places: state.definitions.places
            })
        )
        .catch((err) => this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
            Observable.of(new actions.RelocationsLoadFailAction(err))
          ])
        )
    );
}
