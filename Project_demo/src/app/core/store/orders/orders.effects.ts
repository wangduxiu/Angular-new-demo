import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Actions, Effect } from '@ngrx/effects';
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
import { OrderRestService } from '../../services/rest/order.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import * as actions from './orders.actions';

@Injectable()
export class OrdersEffects extends AbstractEffects {

  constructor(private store: Store<RootState>,
    azureMonitoringService: AzureMonitoringService,
    private adalService: AdalService,
    private actions$: Actions,
    private orderRestService: OrderRestService,
    translateService: TranslateService,
    public dialog: MdDialog) {
    super(translateService, azureMonitoringService);
  }

  @Effect()
  loadOrders$: Observable<Action>
    = this.actions$
    .ofType(actions.ORDERS_LOAD)
    .debounceTime(50) // Avoid double click
    .withLatestFrom(this.store, (action, state) => {
      return {state};
    })
    .switchMap(({state}) => {
      let customers = null;
      if (state.session.userContext.isTransporter) {
        customers = state.session.userContext.customers;
      }
        return this.orderRestService.getOrders(state.orders.filter, customers)
          .map(orders =>
            new actions.OrdersLoadSuccessAction(
              {
                orders,
                definitions: state.definitions,
                places: state.contractDetails.places
              })
          )
          .catch((err) => this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
              Observable.of(new actions.OrdersLoadFailAction(err))
            ])
          );
      }
    );


  @Effect()
  downloadOrders$: Observable<Action>
    = this.actions$
    .ofType(actions.ORDERS_DOWNLOAD)
    .filter(action => this.adalService.isAuthenticated)
    .debounceTime(50)
    .switchMap(action =>
      this.orderRestService.getOrdersAsDocument(action.payload.filter, action.payload.totalItems, action.payload.exportType)
        .map((data: any) => {
          const filenameRegexResult = (/filename=([^;]*)/g).exec(data.headers.get('content-disposition'));
          const filename = filenameRegexResult.length && filenameRegexResult[1] || `report.${action.payload.exportType === 'XLS' ? 'xlsx' : action.payload.exportType.toLowerCase()}`;
          return new actions.OrdersDownloadSuccessAction({filename, blob: data._body});
        })
        .catch(err => this.handleFail(err, `ERRORS.${action.payload.exportType}_DOWNLOAD_FAILED.TITLE`, [Observable.of(new actions.OrdersDownloadFailAction(err))]))
    );

  @Effect()
  acceptDeviation$: Observable<Action>
    = this.actions$
    .ofType(actions.ORDER_ACCEPT_DEVIATION)
    .debounceTime(50)
    .switchMap((action) =>
      this.orderRestService
        .acceptDeviation(action.payload.ccrNumber)
        .map(orderArray => new actions.OrderAcceptDeviationSuccessAction(action.payload))
        .catch((error: Error) => this.handleFail(error, 'ORDERS.LIST.LABELS.ACCEPT_DEVIATION', [
            Observable.of(new actions.OrderAcceptDeviationFailAction({error, ccrNumber: action.payload.ccrNumber}))
          ])
        )
    );

  @Effect()
  rejectDeviation$: Observable<Action>
    = this.actions$
    .ofType(actions.ORDER_REJECT_DEVIATION)
    .debounceTime(50)
    .switchMap((action) =>
      this.orderRestService
        .rejectDeviation(action.payload.ccrNumber)
        .map(orderArray => new actions.OrderRejectDeviationSuccessAction(action.payload))
        .catch((error: Error) => this.handleFail(error, 'ORDERS.LIST.LABELS.REJECT_DEVIATION', [
            Observable.of(new actions.OrderRejectDeviationFailAction({error, ccrNumber: action.payload.ccrNumber}))
          ])
        )
    );

  @Effect() loadLatestFlows$: Observable<{}> = this.actions$
    .ofType(actions.DASHBOARD_TILE_LATEST_ORDERS_LOAD)
    .withLatestFrom(this.store, (action, state) => {
      return { state };
    })
    .switchMap(({ state }) => {
      return this.orderRestService.getLatestOrders(state.session.activeCustomer && state.session.activeCustomer.id)
        .map((orders) => {
          return new actions.DasboardTileLatestOrdersLoadSuccess({ orders });
        })
        .catch(err => {
          return Observable.of(new actions.DasboardTileLatestOrdersLoadFail(err));
          // this.handleFail(err, 'Get Latest Flows', [Observable.of(new actions.DasboardTileLatestOrdersLoadFail(err))])
        });
    });


}
