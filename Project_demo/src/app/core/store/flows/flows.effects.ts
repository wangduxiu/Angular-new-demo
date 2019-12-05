import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { go } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { RootState } from '../';
import { AdalService } from '../../services/adal/adal.service';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';
import { FlowRestService } from '../../services/rest/flow.rest.service';
import { util } from '../../util/util';
import { AbstractEffects } from '../AbstractEffects';
import * as actions from './flows.actions';

@Injectable()
export class FlowsEffects extends AbstractEffects {

  constructor(
    private store: Store<RootState>,
    azureMonitoringService: AzureMonitoringService,
    private adalService: AdalService,
    private actions$: Actions,
    private flowRestService: FlowRestService,
    translateService: TranslateService) {
    super(translateService, azureMonitoringService);
  }

  @Effect()
  loadFlows$: Observable<Action>
    = this.actions$
    .ofType(actions.FLOWS_LOAD)
    .debounceTime(50)
    .withLatestFrom(this.store, (action, state) => {
      return { state };
    })
    .switchMap(({ state }) =>
      this.flowRestService
        .getFlows(state.flows.filter) // Request flows
        .map(
          flows =>
            new actions.FlowsLoadSuccessAction({
              flows,
              definitions: state.definitions,
              places: state.contractDetails.places,
              handshakes: state.contractInfo.handshakes
            })
        )
    )
    .catch((err) => this.handleFail(err, 'FLOWS.NOTIFICATIONS.FIND_FLOWS', [
        Observable.of(new actions.FlowsLoadFailAction(err))
      ])
    );


  @Effect()
  acceptFlow$: Observable<Action>
    = this.actions$
    .ofType(actions.FLOWS_ACCEPT_FLOW_START)
    .withLatestFrom(this.store, (action, state) => {
      return { flow: action.payload.flow, statusses: state.definitions.flow.status };
    })
    .switchMap(({statusses, flow}) =>
      this.flowRestService
        .acceptFlow(flow)
        .map(result => {
          let json = JSON.parse(result._body);
          json.status = statusses.find(status => status.id == json.status);
          return new actions.FlowsAcceptFlowSuccessAction(json);
        })
        .catch((err) => this.handleFail(err, 'FLOWS.NOTIFICATIONS.ACCEPT_FLOW', [
            Observable.of(new actions.FlowsAcceptFlowFailAction(util.getErrorMessage(err)))
          ])
        )
    );

  /**
   * Refresh flow list after successful accept or cancel flow.
   */
  @Effect()
  acceptOrCancelSuccessFlow$: Observable<Action>
    = this.actions$
    .ofType(actions.FLOWS_ACCEPT_FLOW_SUCCESS, actions.FLOWS_CANCEL_FLOW_SUCCESS)
    .switchMap(({statusses, flow}) => Observable.of(go('/flows/refresh')));

  @Effect()
  cancelFlow$: Observable<Action>
    = this.actions$
    .ofType(actions.FLOWS_CANCEL_FLOW_START)
    .withLatestFrom(this.store, (action, state) => {
      return { flow: action.payload.flow, statusses: state.definitions.flow.status };
    })
    .switchMap(({statusses, flow}) =>
      this.flowRestService
        .cancelFlow(flow)
        .map(result => {
          let json = JSON.parse(result._body);
          json.status = statusses.find(status => status.id == json.status);
          return new actions.FlowsCancelFlowSuccessAction(json);
        })
        .catch((err) => this.handleFail(err, 'FLOWS.NOTIFICATIONS.CANCEL_FLOWS', [
            Observable.of(new actions.FlowsCancelFlowFailAction(err))
          ])
        )
    );

  @Effect()
  downloadFlowsFile$: Observable<Action>
    = this.actions$
    .ofType(actions.FLOWS_DOWNLOAD)
    .debounceTime(50)
    .switchMap(action =>
      this.flowRestService.getFlowsAsDocument(action.payload.filter, action.payload.totalItems, action.payload.exportType)
        .map((data: any) => {
          const filenameRegexResult = (/filename=([^;]*)/g).exec(data.headers.get('content-disposition'));
          const filename = filenameRegexResult.length && filenameRegexResult[1] || 'report.xlsx';
          return new actions.FlowsDownloadSuccessAction({ filename, blob: data._body });
        })
        .catch(err => this.handleFail(err, 'FLOWS.NOTIFICATIONS.DOWNLOAD_FILE', [Observable.of(new actions.FlowsDownloadFailAction(err))]))
    );

  @Effect() loadLatestFlows$: Observable<{}> = this.actions$
    .ofType(actions.DASHBOARD_TILE_LATEST_FLOWS_LOAD)
    .withLatestFrom(this.store, (action, state) => {
      return { state };
    })
    .switchMap(({ state }) => {
      return this.flowRestService.getLatestFlows(state.session.activeCustomer && state.session.activeCustomer.id)
        .map((flows) => {
          return new actions.DasboardTileLatestFlowsLoadSuccess({ flows });
        })
        .catch(err => {
          return Observable.of(new actions.DasboardTileLatestFlowsLoadFail(err));
          // this.handleFail(err, 'Get Latest Flows', [Observable.of(new actions.DasboardTileLatestFlowsLoadFail(err))])
        });
    });

  @Effect() loadFlowTypes$: Observable<{}> = this.actions$
    .ofType(actions.FLOW_TYPES_LOAD)
    .filter(action => this.adalService.isAuthenticated)
    .withLatestFrom(this.store, (action, state) => {
      return { state };
    })
    .switchMap(({ state }) => {
      return this.flowRestService.getFlowTypes(state.session.activeCustomer && state.session.activeCustomer.id)
        .map((flowTypes) => {
          return new actions.GetFlowTypesLoadSuccessAction({ ...flowTypes, definitions: state.definitions });
        })
        .catch((err) => {
          return this.handleFail(err, 'Get Order Types', [
            Observable.of(go('/dashboard')),
            Observable.of(new actions.GetFlowTypesLoadFailAction(err))
          ]);
        });
    });
}
