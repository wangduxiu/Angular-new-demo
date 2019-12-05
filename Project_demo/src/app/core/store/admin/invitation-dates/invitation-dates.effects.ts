import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { AdalService } from '../../../services/adal/adal.service';
import * as actions from './invitation-dates.actions';
import { InvitationDatesRestService } from '../../../services/rest/admin/invitation-dates.rest.service';

@Injectable()
export class InvitationDatesEffects {

  constructor(private actions$: Actions, private invitationDatesRestService: InvitationDatesRestService, private adalService: AdalService) {
  }

  @Effect()
  loadClientInvitationDate$: Observable<Action> = this.actions$
    .ofType(actions.ADMIN_INVITATION_DATES_LOAD_CLIENT)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(action =>
      this.invitationDatesRestService.getClientUserInvitationDate()
        .map(date => new actions.AdminInvitationDatesLoadClientSuccessAction(date))
        .catch((err) => {
          return Observable.of(new actions.AdminInvitationDatesLoadClientFailAction(err));
        }),
    );

  @Effect()
  loadEpsInvitationDate$: Observable<Action> = this.actions$
    .ofType(actions.ADMIN_INVITATION_DATES_LOAD_EPS)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(action =>
      this.invitationDatesRestService.getEpsUserInvitationDate()
        .map(date => new actions.AdminInvitationDatesLoadEpsSuccessAction(date))
        .catch((err) => {
          return Observable.of(new actions.AdminInvitationDatesLoadEpsFailAction(err));
        }),
    );

  @Effect()
  saveClientInvitationDate$: Observable<Action> = this.actions$
    .ofType(actions.ADMIN_INVITATION_DATES_SAVE_CLIENT)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(action =>
      this.invitationDatesRestService.saveClientUserInvitationDate(action.payload)
        .map(success => new actions.AdminInvitationDatesSaveClientSuccessAction(success))
        .catch((err) => {
          return Observable.of(new actions.AdminInvitationDatesSaveClientFailAction(err));
        }),
    );

  @Effect()
  saveEpsInvitationDate$: Observable<Action> = this.actions$
    .ofType(actions.ADMIN_INVITATION_DATES_SAVE_EPS)
    .filter(action => this.adalService.isAuthenticated)
    .switchMap(action =>
      this.invitationDatesRestService.saveEpsUserInvitationDate(action.payload)
        .map(success => new actions.AdminInvitationDatesSaveEpsSuccessAction(success))
        .catch((err) => {
          return Observable.of(new actions.AdminInvitationDatesSaveEpsFailAction(err));
        }),
    );


}
