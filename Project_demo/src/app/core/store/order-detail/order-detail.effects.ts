import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
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
import { DocumentRestService } from '../../services/rest/document.rest.service';
import { OrderRestService } from '../../services/rest/order.rest.service';
import { util } from '../../util/util';
import { AbstractEffects } from '../AbstractEffects';
import { CalculatedTruckLoad } from '../florder-detail/florder-detail.interface';
import { ShowNotificationAction } from '../notification/notification.actions';
import * as templateActions from '../template/template.actions';
import * as actions from './order-detail.actions';
import { RecurrenceDates } from './order-detail.interface';

@Injectable()
export class OrderDetailEffects extends AbstractEffects {

  constructor(private store: Store<RootState>, azureMonitoringService: AzureMonitoringService, private actions$: Actions, private orderRestService: OrderRestService, private documentRestService: DocumentRestService, translateService: TranslateService, public dialog: MdDialog) {
    super(translateService, azureMonitoringService);
  }

  @Effect() createOrder$: Observable<Action> = this.actions$
    .ofType(actions.ORDERDETAIL_CREATE_SUBMIT)
    .debounceTime(50)
    .withLatestFrom(this.store, (action, state) => {
      return {
        payload: action.payload,
        state
      };
    })
    .switchMap(({payload, state}) => {
      let selectedDates;
      if (state.editOrderDetail.recurrenceDates) {
        selectedDates = state.editOrderDetail.recurrenceDates.filter(date => date.saving).map(date => date.createDate);
      } else if (Array.isArray(state.editOrderDetail.orderDetail.planning.loadingDate)) {
        selectedDates = state.editOrderDetail.orderDetail.planning.loadingDate;
      } else {
        selectedDates = [state.editOrderDetail.orderDetail.planning.loadingDate as string];
      }
      const orderDetail = {
        ...state.editOrderDetail.orderDetail,
        planning: {
          ...state.editOrderDetail.orderDetail.planning,
          loadingDate: selectedDates
        }
      };
      return this.orderRestService
        .createOrder(orderDetail, payload.emailAddresses)
        .map(result => new actions.OrderDetailCreateSubmitSuccess({
          result,
          emailAdresses: payload.emailAdresses
        }))
        .catch((err) => this.handleFail(err, 'ORDERS.DETAIL.LABELS.SUBMIT_ORDER', [
          Observable.of(new actions.OrderDetailCreateSubmitFail(err))
        ]));
    });

  @Effect({dispatch: false}) createOrderSuccess$: Observable<Action> = this.actions$
    .ofType(actions.ORDERDETAIL_CREATE_SUBMIT_SUCCESS)
    .debounceTime(50)
    .withLatestFrom(this.store, (action, state) => {
      return {
        payload: action.payload,
        state
      };
    })
    .switchMap(({payload, state}) => {
      if (state.editOrderDetail.orderDetail.createTemplate) {
        this.store.dispatch(new templateActions.TemplateSaveFromOrderAction({
          silentSuccess: true,
          create: true
        }));
      }
      return Observable.of(null);
    });

  @Effect() loadOrder$: Observable<Action> = this.actions$
    .ofType(actions.ORDERDETAIL_OPEN)
    .debounceTime(50)
    .map(action => action.payload)
    .withLatestFrom(this.store, (payload, state) => {
      return {
        payload,
        state
      };
    })
    .switchMap(({payload, state}) => {
      return this.orderRestService
        .getOrder(payload.etmOrderNumber, payload.salesOrderNumber, payload.customerIds)
        .map(result => new actions.OrderDetailOpenSuccess({
          orderDetail: result,
          definitions: state.definitions
        }))
        .catch((err) => this.handleFail(err, 'ORDERS.DETAIL.LABELS.OPEN_ORDER', [
          Observable.of(new actions.OrderDetailOpenFail(err))
        ]));
    });

  @Effect() triggerRequestDeliveryDates$: Observable<Action> = this.actions$
    .ofType(actions.ORDERDETAIL_CREATE_EDIT_ORDER_PLANNING)
    .withLatestFrom(this.store, (action, state) => {
      return {state};
    })
    .switchMap(({state}) => {
      if (!state.editOrderDetail.mode.createTemplate && !state.editOrderDetail.mode.editTemplate) {
        return Observable.of(new actions.OrderDetailRequestDeliveryDates(new actions.OrderDetailCreateEditOrderPlanningGetDatesSuccess()));
      }
      return Observable.of(new actions.OrderDetailCreateEditOrderPlanningGetDatesSuccess());
    });

  @Effect() triggerRequestDeliveryDatesWhenSavingOrderDetails$: Observable<Action> = this.actions$
    .ofType(actions.ORDERDETAIL_CREATE_SAVE_ORDER_DETAIL)
    .withLatestFrom(this.store, (action, state) => {
      return {
        action,
        state
      };
    })
    .switchMap(({action, state}) => {
      if (!state.editOrderDetail.mode.createTemplate && !state.editOrderDetail.mode.editTemplate) {
        if (action.payload.preventGetDeliveryDatesCall) {
          return Observable.of(new actions.OrderDetailSaveOrderDetailGetDatesSuccess());
        } else {
          return Observable.of(new actions.OrderDetailRequestDeliveryDates(new actions.OrderDetailSaveOrderDetailGetDatesSuccess()));
        }
      }
      return Observable.of(new actions.OrderDetailSaveOrderDetailGetDatesSuccess());
    });

  // ORDERDETAIL_CREATE_START
  // FlowDetailCreateSetDeliveryMethod
  @Effect() requestDeliveryDates$: Observable<any> = this.actions$
    .ofType(actions.ORDERDETAIL_REQUEST_DELIVERY_DATES)
    .debounceTime(50)
    .withLatestFrom(this.store, (action, state) => {
      return {
        type: action.type,
        payload: action.payload,
        state
      };
    })
    .switchMap(({type, payload, state}) => {
      return this.orderRestService
        .getDeliveryDates(state.editOrderDetail.orderDetail.deliveryMethod)
        .switchMap(result => {
          if (payload) {
            return Observable.from([
              new actions.OrderDetailRequestDeliveryDatesSuccess(result),
              payload
            ]);
          } else {
            return Observable.from([new actions.OrderDetailRequestDeliveryDatesSuccess(result)]);
          }
        }).catch(error => {
          return this.handleFail(error, 'ORDERS.DETAIL.LABELS.GET_DELIVERY_DATES', [
            Observable.of(new actions.OrderDetailRequestDeliveryDatesFail(error))
          ]);
        });
    });

  /*
   Start calculation when material is added / removed / edited
   */
  checkPalletFloorQuantitySuccess(material, successObservables, result): Observable<Action> {
    const overload = result.message && (result.message.type === 'E' || result.message.type === 'I' || result.message.type === 'W');
    let warningAction = null;
    const type = result.message && result.message.type === 'E' ? 'warning' : 'info';
    if (overload) {
      if (type === 'warning') { // material can't be added, a warning is shown
        return Observable.from([
          new actions.OrderDetailCreateSaveMaterialOverload({
            material,
            calculation: result as CalculatedTruckLoad
          }),
          new ShowNotificationAction({
            type,
            message: result.message.description,
            modal: true,
            disableClose: false
          })
        ]);
      } else { // Material will be added but user is informed of max truckload
        warningAction = new ShowNotificationAction({
          type,
          message: result.message.description,
          modal: false,
          disableClose: false
        });
      }
    }
    return successObservables(result, warningAction); // crappy implementation

  }

  @Effect() calculateAfterRemoveMaterial$ = this.actions$
    .ofType(actions.ORDERDETAIL_CREATE_DELETE_MATERIAL)
    .withLatestFrom(this.store, (action, state) => {
      return {
        payload: action.payload,
        state
      };
    })
    .switchMap(({payload, state}) => {
      const orderDetail = state.editOrderDetail.orderDetail;

      const showNotificationAction = new ShowNotificationAction({
        type: 'success',
        messageCode: 'ORDERS.MATERIAL.NOTIFICATIONS.MATERIAL_REMOVED',
        modal: false,
        disableClose: false
      });

      const restCall = (state.editOrderDetail.mode.createTemplate || state.editOrderDetail.mode.editTemplate) ? this.orderRestService.checkPalletFloorQuantitySuccessDummy.bind(this.orderRestService) : this.orderRestService.checkPalletFloorQuantity.bind(this.orderRestService);
      return restCall(orderDetail)
        .switchMap((result: any) => {
          const returnActions = [];
          this.checkPalletFloorQuantitySuccess(null, (result, warningAction) => { // warningAction = crappy solution to a late fix just before PROD-transport for BE/NL
            returnActions.push(new actions.OrderDetailLoadTruckCalculateSuccess(result as CalculatedTruckLoad));
            if (warningAction) {
              returnActions.push(warningAction);
            } else {
              returnActions.push(showNotificationAction);
            }
          }, result);
          return Observable.from(returnActions);
        })

        .catch((err) => this.handleFail(err, 'ERRORS.ORDER.CREATE.TRUCK_LOAD', [
          Observable.of(new actions.OrderDetailLoadTruckCalculateFail(err))
        ]));
    });

  @Effect() calculateLoadAddMaterial$ = this.actions$
    .ofType(actions.ORDERDETAIL_CREATE_SAVE_MATERIAL_START)
    .withLatestFrom(this.store, (action, state) => {
      return {
        payload: action.payload,
        state
      };
    })
    .switchMap(({payload, state}) => {
      const orderDetail = util.deepCopy(state.editOrderDetail.orderDetail);
      const material = payload.material;
      const materialExists = orderDetail.materials.findIndex(m => m.internalId === material.internalId);
      if (materialExists >= 0) {
        orderDetail.materials.splice(materialExists, 1, material);
      } else {
        orderDetail.materials.push(material);
      }

      const actionsArray: Action[] = [];
      if (payload.preventRestCall) {
        actionsArray.push(new actions.OrderDetailCreateSaveMaterialSuccess({
          calculation: null,
          material
        }));
        if (payload.showPopup) {
          actionsArray.push(new ShowNotificationAction({
            type: 'success',
            messageCode: 'ORDERS.MATERIAL.NOTIFICATIONS.MATERIAL_ADDED',
            modal: false,
            disableClose: false
          }));
        }
        return Observable.from(actionsArray);
      } else {
        return this.orderRestService.checkPalletFloorQuantity(orderDetail)
          .switchMap(this.checkPalletFloorQuantitySuccess.bind(this, material, (result, warningAction) => {
            actionsArray.push(new actions.OrderDetailCreateSaveMaterialSuccess({
              calculation: result as CalculatedTruckLoad,
              material
            }));
            if (payload.showPopup) {
              actionsArray.push(warningAction || new ShowNotificationAction({
                type: 'success',
                messageCode: 'ORDERS.MATERIAL.NOTIFICATIONS.MATERIAL_ADDED',
                modal: false,
                disableClose: false
              }));
            }
            return Observable.from(actionsArray);
          }))
          .catch((err) => this.handleFail(err, 'ERRORS.ORDER.CREATE.TRUCK_LOAD', [
            Observable.of(new actions.OrderDetailCreateSaveMaterialFail({
              error: err,
              material
            }))
          ]));
      }
    });

  @Effect() copyOrderNoValidContract$ = this.actions$
    .ofType(actions.ORDERDETAIL_COPY_OPEN_ORDER_NO_VALID_CONTRACT)
    .switchMap(() => Observable.of(new ShowNotificationAction({
      type: 'error',
      messageCode: 'ERRORS.COPY_ORDER.NO_VALID_CONTRACT',
      modal: true,
      disableClose: false
    })));

  @Effect() downloadDocument$: Observable<Action> = this.actions$
    .ofType(actions.ORDERDETAIL_DOCUMENT_DOWNLOAD)
    .debounceTime(50)
    .withLatestFrom(this.store, (action, state) => {
      return {state, action};
    })
    .switchMap(({action, state}) => {
      const customerIds = state.session.userContext.isTransporter ? state.session.userContext.customers.map(c => c.id) : [];
      return this.documentRestService.getDocument(action.payload.documentId, customerIds)
        .map((data: any) => {
          const filenameRegexResult = (/filename=([^;]*)/g).exec(data.headers.get('content-disposition'));
          const filename = filenameRegexResult.length && filenameRegexResult[1] || `report.${action.payload.extension.toUpperCase() === 'XLS' ? 'xlsx' : action.payload.extension.toLowerCase()}`;
          return new actions.OrderDetailDocumentDownloadSuccessAction({
            filename,
            blob: data._body
          });
        })
        .catch(err => this.handleFail(err, `ERRORS.${action.payload.extension}_DOWNLOAD_FAILED.TITLE`, [Observable.of(new actions.OrderDetailDocumentDownloadFailAction(err))]));
    });

  @Effect() downloadCCRDocument$: Observable<Action> = this.actions$
    .ofType(actions.ORDERDETAIL_CCR_DOCUMENT_DOWNLOAD)
    .debounceTime(50)
    .switchMap(action => this.documentRestService.getCCRDocument(action.payload.documentId)
      .map((data: any) => {
        const filenameRegexResult = (/filename=([^;]*)/g).exec(data.headers.get('content-disposition'));
        const filename = filenameRegexResult.length && filenameRegexResult[1] || `report.${action.payload.extension.toUpperCase() === 'XLS' ? 'xlsx' : action.payload.extension.toLowerCase()}`;
        return new actions.OrderDetailCCRDocumentSuccessAction({
          filename,
          blob: data._body
        });
      })
      .catch(err => this.handleFail(err, `ERRORS.${action.payload.extension}_DOWNLOAD_FAILED.TITLE`, [Observable.of(new actions.OrderDetailCCRDocumentFailAction(err))])));

  @Effect() getRecurrenceDates: Observable<Action> = this.actions$
    .ofType(actions.ORDERDETAIL_GET_RECURRENCE_DATES)
    .debounceTime(50)
    .withLatestFrom(this.store, (action, state) => {
      return state;
    })
    .switchMap((state: RootState) => this.orderRestService
      .getRecurrenceDates(state.editOrderDetail.orderDetail)
      .map((data: RecurrenceDates) => {
        return new actions.OrderDetailGetRecurrenceDatesSuccess(data);
      })
      .catch(err => this.handleFail(err, `ERRORS.GET_RECURRENCE_DATES.TITLE`, [Observable.of(new actions.OrderDetailGetRecurrenceDatesFail(err))])));
}

