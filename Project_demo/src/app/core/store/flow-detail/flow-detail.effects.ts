import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import { Observable } from 'rxjs/Observable';
import { RootState } from '..';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';
import { FlowRestService } from '../../services/rest/flow.rest.service';
import { util } from '../../util/util';
import { AbstractEffects } from '../AbstractEffects';
import { Material } from '../florder-detail/florder-detail.interface';
import { Florder } from '../florders/florder.interface';
import * as actions from './flow-detail.actions';

@Injectable()
export class FlowDetailEffects extends AbstractEffects {

  constructor(private store: Store<RootState>, azureMonitoringService: AzureMonitoringService, private actions$: Actions, private flowRestService: FlowRestService, translateService: TranslateService) {
    super(translateService, azureMonitoringService);
  }

  @Effect() createFlow$: Observable<Action>
    = this.actions$
    .ofType(actions.FLOWDETAIL_CREATE_OR_UPDATE_SUBMIT)
    .debounceTime(50)
    .withLatestFrom(this.store, (action, state) => {
      return {
        state,
        payload: action.payload,
      };
    })
    .switchMap(({ payload, state }) => {
      // Hier wordt bepaald of het een create of een update is
      const restCall = state.editFlowDetail.mode.state === 'edit-confirm' ? this.flowRestService.updateFlow.bind(this.flowRestService) : this.flowRestService.createFlow.bind(this.flowRestService);
      return restCall(state.editFlowDetail.flowDetail)
        .map(result => new actions.FlowDetailCreateOrUpdateSubmitSuccess({ result }))
        .catch((err) => this.handleFail(err, 'Submit flow', [
          Observable.of(new actions.FlowDetailCreateOrUpdateSubmitFail(err)),
        ]),
        );
    });

  @Effect() triggerRequestDeliveryDatesWhenSavingFlowDetails$: Observable<Action> = this.actions$
    .ofType(actions.FLOWDETAIL_CREATE_SAVE_FLOW_DETAIL)
    .withLatestFrom(this.store, (action, state) => {
      return {
        action,
        state,
      };
    })
    .switchMap(({ action, state }) => {
      if (!state.editFlowDetail.mode.createTemplate && 
        !state.editFlowDetail.mode.editTemplate &&
        state.editFlowDetail.mode.state !== 'edit-confirm') {
        return Observable.of(new actions.FlowDetailRequestDeliveryDates(new actions.FlowDetailSaveFlowDetailGetDatesSuccess()));
      }
      return Observable.of(new actions.FlowDetailSaveFlowDetailGetDatesSuccess());
    });

  // ORDERDETAIL_CREATE_START
  // FlowDetailCreateSetDeliveryMethod
  @Effect() requestDeliveryDates$: Observable<any>
    = this.actions$
    .ofType(actions.FLOWDETAIL_REQUEST_DELIVERY_DATES)
    .debounceTime(50)
    .withLatestFrom(this.store, (action, state) => {
      return {
        state,
        type: action.type,
        payload: action.payload,
      };
    })
    .switchMap(({ type, payload, state }) => {
      return this.flowRestService
        .getDeliveryDates(state.editFlowDetail.flowDetail.deliveryMethod)
        .switchMap(result => {
          if (payload) {
            return Observable.from([
              new actions.FlowDetailRequestDeliveryDatesSuccess(result),
              payload,
            ]);
          } else {
            return Observable.from([new actions.FlowDetailRequestDeliveryDatesSuccess(result)]);
          }
        })
        .catch((err) => this.handleFail(err, 'ORDERS.DETAIL.LABELS.GET_DELIVERY_DATES', [
          Observable.of(new actions.FlowDetailRequestDeliveryDatesFail(err)),
        ]),
        );
    });

  @Effect() downloadDocument$: Observable<Action>
    = this.actions$
    .ofType(actions.FLOWDETAIL_DOCUMENT_DOWNLOAD)
    .debounceTime(50)
    .switchMap(action =>
      this.flowRestService.getFlowDocument(action.payload.etmOrderNumber)
        .map((data: any) => {
          const filenameRegexResult = (/filename=([^;]*)/g).exec(data.headers.get('content-disposition'));
          const filename = filenameRegexResult.length && filenameRegexResult[1] || `report.${action.payload.extension.toUpperCase() === 'XLS' ? 'xlsx' : action.payload.extension.toLowerCase()}`;
          return new actions.FlowDetailDocumentDownloadSuccessAction({
            filename,
            blob: data._body,
          });
        })
        .catch(err => this.handleFail(err, `ERRORS.${action.payload.extension}_DOWNLOAD_FAILED.TITLE`, [Observable.of(new actions.FlowDetailDocumentDownloadFailAction(err))])),
    );

  @Effect() checkFlowDate$: Observable<Action>
    = this.actions$
    .ofType(actions.FLOWDETAIL_CHECK_FLOW_DATE)
    .debounceTime(50)
    .switchMap(action =>
      this.flowRestService.validateFlowDate(action.payload.value, action.payload.frequency, action.payload.fromId, action.payload.toId, action.payload.flowWeek)
        .map((data: any) => {
          return new actions.FlowDetailCheckFlowDateSuccessAction(JSON.parse(data._body));
        })
        .catch(err => ([
          new actions.FlowDetailCheckFlowDateErrorAction(JSON.parse(err._body)),
        ]),
        ),
    );

  @Effect() flowAccept: Observable<Action>
    = this.actions$
    .ofType(actions.FLOWDETAIL_ACCEPT_FLOW_START)
    .withLatestFrom(this.store, (action, state) => {
      return { state };
    })
    .switchMap(({ state }) => {
      const flowDetail = state.editFlowDetail.flowDetail;
      const flow: Florder = {
        id: null,
        orderType: null,
        customerRefNumber: flowDetail.deliveryMethod.customerReferenceNumber,
        senderRefNumber: flowDetail.deliveryMethod.senderReferenceNumber,
        salesOrderNumber: null,
        deliveryNumber: null,
        shipmentNumber: null,
        etmOrderNumber: flowDetail.etmOrderNumber,
        from: flowDetail.deliveryMethod.from,
        to: flowDetail.deliveryMethod.to,
        requestedUnloadingDate: null,
        confirmedUnloadingDate: null,
        shippingCondition: null,
        globalType: flowDetail.globalType,
        status: null,
        transporter: flowDetail.deliveryMethod.transporter,
        clearing: '' + flowDetail.deliveryMethod.clearing,
        licensePlate: flowDetail.deliveryMethod.licensePlate,
        comments: flowDetail.deliveryMethod.remarksHandshaker,
        wholesalerId: flowDetail.deliveryMethod.wholesaler && flowDetail.deliveryMethod.wholesaler.id || null,

        updateTime: flowDetail.updateTime,
        updateDate: flowDetail.updateDate,
        updateBy: flowDetail.updateBy,
        flowDate: flowDetail.planning.flowDate,

        flowLineItems: flowDetail.materials.map((m: Material) => {
          return {
            itemNumber: m.internalId,
            packingId: m.packingId,
            packingStatus: m.packingStatus && m.packingStatus,
            originalQuantity: 0, // Is skipped
            definitiveQuantity: parseInt(m.packingQuantity, 10),
            differenceQuantity: 0, // Is skipped
            contentId: m.contentId,
            lineReferenceId: m.lineReferenceId,
            isNew: m.isNew,
          };
        }),
      };

      return this.flowRestService
        .acceptFlow(flow)
        .map(orderArray => new actions.FlowAcceptFlowSuccessAction({ flow }))
        .catch((err) => this.handleFail(err, 'FLOWS.NOTIFICATIONS.ACCEPT_FLOW', [
          Observable.of(new actions.FlowAcceptFlowFailAction(util.getErrorMessage(err))),
        ]),
        );
    });
}
