import { Injectable } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { Actions, Effect } from '@ngrx/effects';
import { go } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { RelocationSandbox } from 'app/core/sandboxes/relocation.sandbox';
import { RelocationRestService } from 'app/core/services/rest/relocation.rest.service';
import { CalendarCreateRelocationModalComponent } from 'app/modules/calendar/calendar-create-relocation-modal/calendar-create-relocation-modal.component';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { RootState } from '../';
import { CalendarCreateOrderModalComponent } from '../../../modules/calendar/calendar-create-order-modal/calendar-create-order-modal.component';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';
import { OrderRestService } from '../../services/rest/order.rest.service';
import { TemplateRestService } from '../../services/rest/template.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import * as actions from './calendar.actions';
import { FlordersFilter } from '../florders/florders-filter.interface';
import { mapFlordersTo2Florders } from '../orders/orders.reducer';

@Injectable()
export class CalendarEffects extends AbstractEffects {

  constructor(
    private store: Store<RootState>,
    azureMonitoringService: AzureMonitoringService,
    private actions$: Actions,
    private orderRestService: OrderRestService,
    private relocationRestService: RelocationRestService,
    private templateRestService: TemplateRestService,
    translateService: TranslateService,
    public dialog: MdDialog,
    private sandbox: RelocationSandbox,
  ) {
    super(translateService, azureMonitoringService);
  }

  @Effect()
  loadOrders$: Observable<Action> = this.actions$
    .ofType(actions.CALENDAR_ORDERS_LOAD)
    .debounceTime(50)
    .switchMap(action => // Register to this event, unregister previous if new event occurs.
      this.orderRestService.getOrdersForCalendar({...action.payload.filter})   // Request orders
        .map(daysWithFlordersInfoTO =>
          new actions.CalendarOrdersLoadSuccessAction(
            Object.assign({
              days: daysWithFlordersInfoTO.map(to => {
                const florderInfos = [];
                to.orders.forEach(order => {
                  if (order.salesOrderNumber && order.salesOrderNumber.length) {
                    order.salesOrderNumber.forEach(salesOrderNumber => {
                      florderInfos.push({
                        etmOrderNumber: order.etmOrderNumber,
                        salesOrderNumber: salesOrderNumber,
                        isOrder: true,
                        isRelocation: false,
                      });
                    });
                  } else {
                    florderInfos.push({
                      etmOrderNumber: order.etmOrderNumber,
                      salesOrderNumber: null,
                      isOrder: true,
                      isRelocation: false,
                    });
                  }
                });
                return {
                  unloadingDate: to.unloadingDate,
                  totalNumberOfOrders: to.totalNumberOfOrders,
                  florderInfos
                };
              })
            })
          ))
        .catch((err) => {
            if (err._body && err._body.indexOf('No orders found for given criteria') > 0) {
              return Observable.of(new actions.CalendarOrdersLoadSuccessAction(
                {
                  days: []
                }
              ));
            } else {
              return this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
                Observable.of(new actions.CalendarOrdersLoadFailAction(err)),
              ]);
            }
          }
        )
    );

  @Effect()
  loadRelocations$: Observable<Action> = this.actions$
    .ofType(actions.CALENDAR_RELOCATIONS_LOAD)
    .debounceTime(50)
    .switchMap(action => // Register to this event, unregister previous if new event occurs.
      this.relocationRestService.getRelocationsForCalendar(action.payload.filter)   // Request orders
        .map(daysWithFlordersInfoTO =>
          new actions.CalendarRelocationsLoadSuccessAction(
            Object.assign({
              days: daysWithFlordersInfoTO.map(to => {
                const florderInfos = [];
                to.orders.forEach(order => {
                  // Ignore salesOrderNumbers.  A relocation always has 2 salesOrderNumbers.  Just show 1.
                  florderInfos.push({
                    etmOrderNumber: order.etmOrderNumber,
                    salesOrderNumber: null,
                    isOrder: false,
                    isRelocation: true,
                  });
                });
                return {
                  unloadingDate: to.unloadingDate,
                  totalNumberOfOrders: to.totalNumberOfOrders,
                  florderInfos
                };
              })
            })
          ))
        .catch((err) => {
          if (err._body && err._body.indexOf('No orders found for given criteria') > 0) {
            return Observable.of(new actions.CalendarRelocationsLoadSuccessAction(
              {
                days: []
              }
            ));
          } else {
            return this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
              Observable.of(new actions.CalendarRelocationsLoadFailAction(err)),
            ]);
          }
        })
    );

  @Effect({dispatch: false})
  showCreateOrderModal$: Observable<Action> = this.actions$
    .ofType(actions.CALENDAR_SHOW_CREATE_ORDER_MODAL)
    .switchMap(action => {
      const modalData = action.payload;

        // First load all orders for that day
        const dayFilter: FlordersFilter = {
          ...action.payload.filter,
          unloadingDateFrom: action.payload.day.dateString,
          unloadingDateTo: action.payload.day.dateString,
        };

        const config: MdDialogConfig = {
          width: '75%', height: 'auto', data: {
            ...modalData,
            orders: [],
            loading: true,
          }, role: 'dialog',
        };

        this.showDayOrderModal(config);

        if (action.payload.day.florderInfos.length) {
          return this.orderRestService.getOrders(dayFilter).switchMap(orderTos => {
            const orders = mapFlordersTo2Florders({
              ...action.payload,
              orders: orderTos,
            });
            config.data.orders = orders;
            config.data.loading = false;
            return Observable.of(modalData);
          });
        } else {
          config.data.loading = false;
          return Observable.of(modalData);
        }
      },
    );

  private showDayOrderModal(config: MdDialogConfig) {
    const dialogRef = this.dialog.open(CalendarCreateOrderModalComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.createOrder) {
          if (result.id) {
            // start from template
            this.store.dispatch(go(`orders/new/fromTemplate/${result.id}`, {date: result.date}));
          } else {
            // start from scratch
            this.store.dispatch(go(`orders/new`, {date: result.date}));
          }
        } else if (result.id) {
          // navigate to existing order
          this.store.dispatch(go([`orders/${result.id}`, {salesOrderNumber: result.salesOrderNumber, back: 'calendar/order'}]));
        }
      }
    });
  }

  @Effect({dispatch: false})
  showCreateRelocationModal$: Observable<Action> = this.actions$
    .ofType(actions.CALENDAR_SHOW_CREATE_RELOCATION_MODAL)
    .switchMap(action => {
        const modalData = action.payload;

        // First load all orders for that day
        const dayFilter: FlordersFilter = {
          ...action.payload.filter,
          unloadingDateFrom: action.payload.day.dateString,
          unloadingDateTo: action.payload.day.dateString,
        };

        const config: MdDialogConfig = {
          width: '75%', height: 'auto', data: {...modalData, relocations: []}, role: 'dialog'
        };

        if (action.payload.day.florderInfos.length) {
          return this.relocationRestService.getRelocations(dayFilter).switchMap(orderTos => {
            debugger;
            const relocations = mapFlordersTo2Florders({...action.payload, orders: orderTos});
            config.data.relocations = relocations;
            this.showDayRelocationModal(config);
            return Observable.of(modalData);
          });
        } else {
          this.showDayRelocationModal(config);
          return Observable.of(modalData);
        }
      }
    );

  private showDayRelocationModal(config: MdDialogConfig) {
    const dialogRef = this.dialog.open(CalendarCreateRelocationModalComponent, config);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.createOrder) {
          if (result.id) {
            // start from template
            this.sandbox.createRelocationFromTemplate(result.id, result.date);
          } else {
            // start from scratch
            this.store.dispatch(go(`relocations/new`, {date: result.date}));
          }
        } else if (result.id) {
          // navigate to existing order
          this.store.dispatch(go([`relocations/${result.id}`, {salesOrderNumber: result.salesOrderNumber, back: 'calendar/relocation'}]));
        }
      }
    });
  }


  @Effect() requestOrderDeliveryDatesForTemplate$ =
    this.actions$
      .ofType(actions.CALENDAR_REQUEST_ORDER_DELIVERY_DATES)
      .debounceTime(50)
      .withLatestFrom(this.store, (action, state) => {
        return {state};
      })
      .switchMap(({state}) => {
        //template given
        return this.templateRestService.getTemplateOrderDeliveryDates(state.calendar.selectedTemplate, state.calendar.UI.startDate)
          .map(result => new actions.CalendarRequestOrderDeliveryDatesSuccessAction(result))
          .catch((err) => this.handleFail(err, 'ERRORS.TEMPLATE.CHECK_DELIVERY_DATES', [
            Observable.of(new actions.CalendarRequestOrderDeliveryDatesFailAction(err))
          ]));
      });

  @Effect() requestRelocationUnloadingDatesForTemplate$ =
    this.actions$
      .ofType(actions.CALENDAR_REQUEST_RELOCATION_UNLOADING_DATES)
      .debounceTime(50)
      .withLatestFrom(this.store, (action, state) => {
        return {state};
      })
      .switchMap(({state}) => {
        //template given
        return this.templateRestService.getTemplateRelocationUnloadingDates(state.calendar.selectedTemplate, state.calendar.UI.startDate)
          .map(result => new actions.CalendarRequestRelocationUnloadingDatesSuccessAction(result))
          .catch((err) => this.handleFail(err, 'ERRORS.TEMPLATE.CHECK_DELIVERY_DATES', [
            Observable.of(new actions.CalendarRequestRelocationUnloadingDatesFailAction(err))
          ]));
      });
}
