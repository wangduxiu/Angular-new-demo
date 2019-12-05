import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { go } from '@ngrx/router-store';

import * as actions from './email-actors.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import { RootState } from '..';
import { EmailActorsRestService } from '../../services/rest/email-actors.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import { TranslateService } from '@ngx-translate/core';
import { AdalService } from '../../services/adal/adal.service';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';

@Injectable()
export class EmailActorsEffects extends AbstractEffects {

  constructor(private store: Store<RootState>, azureMonitoringService: AzureMonitoringService, private actions$: Actions, private emailActorsRestService: EmailActorsRestService, translateService: TranslateService, private adalService: AdalService) {
    super(translateService, azureMonitoringService);
  }

  @Effect()
  loadEmailActors$: Observable<Action> = this.actions$
    .ofType(actions.EMAIL_ACTORS_LOAD)
    .filter(action => this.adalService.isAuthenticated)
    .withLatestFrom(this.store, (action, state) => {
      return { state };
    })
    .switchMap(({ state }) => // Register to this event, unregister previous if new event occurs.
      this.emailActorsRestService.getEmailActors(state.session.activeCustomer && state.session.activeCustomer.id)   // Request email actors
        .map(itemArray =>
          new actions.EmailActorsLoadSuccessAction(itemArray))
        .catch((err) => this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
          Observable.of(new actions.EmailActorsLoadFailAction(err)),
        ])
        )
    );

    @Effect()
    createEmailActors$: Observable<Action> = this.actions$
      .ofType(actions.EMAIL_ACTORS_CREATE_OR_UPDATE)
      .withLatestFrom(this.store, (action, state) => {
        return { payload: action.payload, state };
      })
      .switchMap(({ payload, state }) => // Register to this event, unregister previous if new event occurs.
        this.emailActorsRestService.createEmailActors(payload.emailActor, state.session.activeCustomer && state.session.activeCustomer.id)   // Create email actor
          .map(response =>
            new actions.EmailActorsCreateOrUpdateSuccessAction(response))
          .catch((err) => this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
            Observable.of(new actions.EmailActorsCreateOrUpdateFailAction(err)),
          ])
          )
      );

      @Effect()
      deleteEmailActors$: Observable<Action> = this.actions$
        .ofType(actions.EMAIL_ACTORS_DELETE)
        .withLatestFrom(this.store, (action, state) => {
          return { payload: action.payload, state };
        })
        .switchMap(({ payload, state }) => // Register to this event, unregister previous if new event occurs.
          this.emailActorsRestService.deleteEmailActor(payload.id)   // Delete email actor
            .map(response =>
              new actions.EmailActorsDeleteSuccessAction(response))
            .catch((err) => this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
              Observable.of(new actions.EmailActorsDeleteFailAction(err)),
            ])
            )
        );
}
