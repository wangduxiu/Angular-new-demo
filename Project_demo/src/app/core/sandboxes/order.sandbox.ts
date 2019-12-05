import { Injectable } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AbstractSandbox } from 'app/core/sandboxes/abstract.sandbox';
import { ContractInfoCharacteristics, ContractInfoService } from 'app/core/services/contract-info.service';
import { OrderRestService } from 'app/core/services/rest/order.rest.service';
import { TemplateRestService } from 'app/core/services/rest/template.rest.service';
import * as ccrActions from 'app/core/store/ccr-detail/ccr-detail.actions';
import { CCRDetailOpen } from 'app/core/store/ccr-detail/ccr-detail.actions';
import { CalculatedTruckLoad, FlorderDetail, OrderDetailTO } from 'app/core/store/florder-detail/florder-detail.interface';
import { ShowNotificationAction } from 'app/core/store/notification/notification.actions';
import * as orderActions from 'app/core/store/order-detail/order-detail.actions';
import { OrderDetailCreateFromTemplate } from 'app/core/store/order-detail/order-detail.actions';
import * as templateActions from 'app/core/store/template/template.actions';
import { OrderTemplateEditAction } from 'app/core/store/template/template.actions';
import { logger } from 'app/core/util/logger';
import 'rxjs/add/operator/delay';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AzureMonitoringService } from '../services/AzureMonitoringService';
import * as fromRoot from '../store';

@Injectable()
export class OrderSandbox extends AbstractSandbox {

  isEpsUser$ = this.store.map(state => state.session.userContext.isEpsUser);
  defaultDepot$ = this.store.map(state => {
    const place = Object.keys(state.customerInfo.places)
      .map(key => state.customerInfo.places[key])
      .find(place => place.default);
    return place;
  });

  constructor(
    store: Store<fromRoot.RootState>,
    translateService: TranslateService,
    azureMonitoringService: AzureMonitoringService,
    private contractInfoService: ContractInfoService,
    private orderRestService: OrderRestService,
    private templateRestService: TemplateRestService,
  ) {
    super(store, translateService, azureMonitoringService);
  }

  loadContractInfoFromOrderTypeToIncoterm(orderTypeId: string): Observable<void> {
    return this.contractInfoService.loadContractInfoFromOrderTypeToIncoterm('ORDER', orderTypeId);
  }

  loadContractInfoFromFromToIncoterm(params: { orderTypeId: string, shippingCondition: string, fromId: string }) {
    return this.contractInfoService.loadContractInfoFromFromToIncoterm({
      ...params,
      type: 'ORDER',
    });
  }

  loadContractInfoMaterials(params: { orderTypeId: string, shippingCondition: string, fromId: string, toId: string, incoterm: string }): Observable<void> {
    return this.contractInfoService.loadContractInfoMaterials({
      ...params,
      type: 'ORDER',
    });
  }

  copyOrder(activeCustomerId: string, etmOrderNumber: string, salesOrderNumber: string) {
    const subject = new Subject<void>();
    this.store.dispatch(new orderActions.OrderDetailCopyOrder({ etmOrderNumber }));

    // Get order
    /*
    I got more info from Piet regarding the 'X'.
    When requesting an order for copy or template, you need the order as it was created -> use the X
    When wanting to see the definitive version of the order, give salesOrderNr, because SAP will fill in other fields (like incoterm) and such.
     */
    this.orderRestService.getOrder(etmOrderNumber, 'X') // UAT 1840 + explanation Piet Borgman, mail 10/08/18 16:39 see mail-piet-2018-08-10-copy-order.png
      .withLatestFrom(this.isEpsUser$, (result, isEpsUser) => ({
        result,
        isEpsUser
      }))
      .subscribe(({ result, isEpsUser }) => {
        // Check if fromId & toId is known in contract
        // IF transport by EPS, then fromId or toId is 'all': depot in contract can change, but doesn't matter for customer
        if (!isEpsUser && result.transport === 'Z1') {
          switch (result.orderType) {
            case 'EPS-CUS':
              result.from.id = 'all';
              break;
            case 'CUS-EPS':
              result.to.id = 'all';
              break;
          }
        }

        this.contractInfoService.loadContractInfoAndCheck(this.orderTypeTOToContractInfoCharacteristics(result)).subscribe(
          isValid => {
            if (isValid) {
              this.store.take(1).subscribe(state => {
                // Store orderDetail in state
                this.store.dispatch(new orderActions.OrderDetailCopyOpenSuccess({
                  orderDetail: result,
                  definitions: state.definitions,
                }));
                // do truck load calculation
                this.calculateTruckLoad(false).subscribe(() => {
                  // load delivery-dates
                  this.getDeliveryDates().subscribe(() => {
                    // Finish observable
                    this.store.dispatch(go('/orders/copy', { back: 'orders' }));
                    subject.next();
                    subject.complete();
                  });
                });
              });
            } else {
              this.handleFail({ messageCode: 'ERRORS.COPY_ORDER.NO_VALID_CONTRACT' }, 'ORDERS.DETAIL.LABELS.COPY_ORDER');
            }
          },
        );
      });
    return subject.asObservable();
  }

  createOrderFromTemplate({ date, templateId }: { date: string; templateId: string }) {
    const subject = new Subject();
    // Get template
    this.templateRestService.getTemplate('ORDER', +templateId).subscribe(template => {
      logger.debug(`just got template`);

      const ci: ContractInfoCharacteristics = {
        type: 'ORDER',
        orderType: template.data.orderType,
        shippingCondition: template.data.transport,
        fromId: template.data.from.id,
        toId: template.data.to.id,
        incoterm: template.data.incoterm,
      };

      this.contractInfoService.loadContractInfoAndCheck(ci).subscribe(isValid => {
        logger.debug(`just checked contractinfo`);
        if (isValid) {
          this.store.take(1).subscribe(state => {
            // Store orderDetail in state
            this.store.dispatch(new OrderDetailCreateFromTemplate({
              template,
              date,
              activeCustomer: state.session.activeCustomer,
              definitions: state.definitions
            }));
            // do truck load calculation
            logger.debug(`dispatched OrderDetailCreateFromTemplate`);
            this.calculateTruckLoad(false).subscribe(() => {
              logger.debug(`loaded truckload`);
              // load delivery-dates
              this.getDeliveryDates().subscribe(() => {
                this.store.dispatch(go('/orders/copy', { back: 'orders' }));

                subject.next(true);
                subject.complete();
              });
            });
          });
        } else {
          this.handleFail({ messageCode: 'ERRORS.CREATE_ORDER_FROM_TEMPLATE.NO_VALID_CONTRACT' }, 'ERRORS.ORDER.CREATE_FROM_TEMPLATE.TITLE');
          subject.error(null);
        }
      });
    });
    return subject.asObservable();
  }

  editTemplate(templateId: string): Observable<boolean> {
    logger.debug('in editTemplate');
    const subject = new Subject<boolean>();
    // Load template if not yet loaded
    this.store
      .take(1)
      .subscribe(state => {

        // Function to continue once the template has been loaded
        function proceedWithTemplate(contractInfoCharacteristics: ContractInfoCharacteristics, cb: Function) {
          this.contractInfoService.loadContractInfoAndCheck(contractInfoCharacteristics, 'ERRORS.EDIT_TEMPLATE.NO_VALID_CONTRACT', 'ERRORS.TEMPLATE.EDIT.TITLE').subscribe(isValid => {
            if (isValid) {
              if (cb) {
                cb();
              }
              // do truck load calculation
              logger.debug(`dispatched OrderTemplateEditAction`);
              this.calculateTruckLoad(false).subscribe(() => {
                logger.debug(`loaded truckload`);
                // load delivery-dates
                this.getDeliveryDates().subscribe(() => {
                  // Finish observable
                  logger.debug(`fetched deliverydates`);
                  subject.next(true);
                  subject.complete();
                });
              });
            } else {
              this.store.dispatch(new ShowNotificationAction({
                type: 'error',
                titleCode: 'ERRORS.TEMPLATE.EDIT.TITLE',
                messageCode: 'ERRORS.TEMPLATE.EDIT.CONTRACT_CHANGED',
                modal: true,
                disableClose: false
              }));
              subject.next(false);
              subject.complete();
            }
          });
        }

        if (!state.editOrderDetail.orderDetail || ('' + state.editOrderDetail.orderDetail.templateId) !== ('' + templateId)) {
          this.templateRestService.getTemplate('ORDER', +templateId).subscribe(template => {
            proceedWithTemplate.call(this, this.orderTypeTOToContractInfoCharacteristics(template.data), () => {
              this.store.dispatch(new OrderTemplateEditAction({
                template,
                definitions: state.definitions,
              }));
            });
          });
        } else {
          proceedWithTemplate.call(this, this.orderDetailToContractInfoCharacteristics(state.editOrderDetail.orderDetail));
        }
      });

    // Take loaded one and validate
    this.store
      .map(state => state.editOrderDetail.orderDetail)
      .filter(orderDetail => !orderDetail || orderDetail.templateId === templateId)
      .take(1)
      .subscribe(state => {
      });

    return subject.asObservable();
  }

  createTemplateFromOrder(param: { etmOrderNumber: string }) {
    const subject = new Subject<boolean>();
    this.store.take(1).subscribe(state => {
      // store start in store
      this.store.dispatch(new templateActions.TemplateCreateFromOrderStart({ etmOrderNumber: param.etmOrderNumber }));
      // Get order
      this.orderRestService.getOrder(param.etmOrderNumber, 'X').subscribe(result => {

        if (!state.session.userContext.isEpsUser && result.transport === 'Z1') {
          switch (result.orderType) {
            case 'EPS-CUS':
              result.from.id = 'all';
              break;
            case 'CUS-EPS':
              result.to.id = 'all';
              break;
          }
        }

        this.contractInfoService.loadContractInfoAndCheck(this.orderTypeTOToContractInfoCharacteristics(result)).subscribe(isValid => {
          if (isValid) {
            // Store result in store
            this.store.dispatch(new templateActions.TemplateCreateFromOrderSuccess({
              orderDetail: result,
              definitions: state.definitions
            }));
            this.calculateTruckLoad(false).subscribe(() => {
              logger.debug(`loaded truckload`);
              // load delivery-dates
              this.getDeliveryDates().subscribe(() => {
                // Finish observable
                logger.debug(`fetched deliverydates`);
                subject.next(true);
                subject.complete();
                this.store.dispatch(go('/orders/template/copy'));
              });
            });
          } else {
            this.handleFail({ messageCode: 'ERRORS.CREATE_TEMPLATE_FROM_ORDER.NO_VALID_CONTRACT' }, 'ORDERS.LIST.BUTTONS.AS_TEMPLATE');
            subject.next(false);
            subject.complete();
          }
        });
      });
    });
    return subject.asObservable();
  }

  openCcrDetail(params: { etmOrderNumber: any; salesOrderNumber: any }) {
    const subject = new Subject<boolean>();

    this.store.dispatch(new CCRDetailOpen({
      salesOrderNumber: params.salesOrderNumber,
      etmOrderNumber: params.etmOrderNumber
    }));

    this.store.take(1).subscribe(state => {
      this.orderRestService
        .getOrder(params.etmOrderNumber, params.salesOrderNumber)
        .subscribe(
          result => {
            this.store.dispatch(new ccrActions.CCRDetailOpenSuccess({
              orderDetail: result,
              definitions: state.definitions
            }));

            this.store
              .map(state => state.editCCRDetail)
              .filter(editCCRDetail => !editCCRDetail.mode.loading)
              .take(1)
              .subscribe(editCCRDetail => {
                if (editCCRDetail.mode.loadSuccess) {
                  this.contractInfoService.loadContractInfoAndCheck(this.orderDetailToContractInfoCharacteristics(editCCRDetail.orderDetail)).subscribe(isValid => {
                    if (!isValid) {
                      this.handleFail({ messageCode: 'ERRORS.CREATE_CCR.NO_VALID_CONTRACT' }, 'ORDERS.FILTER.LABELS.CREATE_CCR');
                    }
                    subject.next(isValid);
                    subject.complete();
                  });
                } else {
                  this.store.dispatch(new ccrActions.CCRDetailOpenFail(null));
                  subject.next(false);
                  subject.complete();
                }
              });
          },
          error => {
            this.store.dispatch(new ccrActions.CCRDetailOpenFail(error));
            subject.error(error);
          }
        );
    });
    return subject.asObservable();
  }

  private calculateTruckLoad(showNotification: boolean): Observable<void> {
    const subject = new Subject<void>();
    logger.debug(`just before dispatch OrderDetailLoadTruckCalculate`);
    setTimeout(() => { // Ensure reducers have processed
      this.store.dispatch(new orderActions.OrderDetailLoadTruckCalculate());
      this.store
        .map(state => state.editOrderDetail.orderDetail)
        .take(1)
        .subscribe((orderDetail: FlorderDetail) => {
          logger.debug(`just before checkPalletFloorQuantity`);
          this.orderRestService.checkPalletFloorQuantity(orderDetail)
            .subscribe((result: CalculatedTruckLoad) => {
              // Store result
              this.store.dispatch(new orderActions.OrderDetailLoadTruckCalculateSuccess(result));

              if (showNotification) {
                const overload = result.message && (result.message.type === 'E' || result.message.type === 'I' || result.message.type === 'W');
                if (overload) {
                  const type = result.message.type === 'E' ? 'warning' : 'info';
                  this.store.dispatch(new ShowNotificationAction({
                    type,
                    message: result.message.description,
                    modal: true,
                    disableClose: false
                  }));
                }
              }
              subject.next();
              subject.complete();
            }, error => {
              this.handleFail(error, '');
              subject.error(error);
            });
        });
    });
    return subject.asObservable();
  }

  private getDeliveryDates(): Observable<void> {
    const subject = new Subject<void>();
    this.store.dispatch(new orderActions.NEOrderDetailRequestDeliveryDates());
    this.store
      .take(1)
      .subscribe(state => {
        this.orderRestService.getDeliveryDates(state.editOrderDetail.orderDetail.deliveryMethod).subscribe(
          result => {
            this.store.dispatch(new orderActions.NEOrderDetailRequestDeliveryDatesSuccess(result));
            subject.next();
            subject.complete();
          },
          error => {
            this.handleFail(error, 'ORDERS.DETAIL.LABELS.GET_DELIVERY_DATES');
            this.store.dispatch(new orderActions.NEOrderDetailRequestDeliveryDatesFail(error));
            subject.error(error);
          });
      });
    return subject.asObservable();
  }

  private orderTypeTOToContractInfoCharacteristics(orderDetailTO: OrderDetailTO): ContractInfoCharacteristics {
    const fromId = orderDetailTO.transport === 'Z1' && orderDetailTO.orderType === 'EPS-CUS' ? '' : orderDetailTO.from.id;
    const toId = orderDetailTO.transport === 'Z1' && orderDetailTO.orderType === 'CUS-EPS' ? '' : orderDetailTO.to.id;
    return {
      type: 'ORDER',
      orderType: orderDetailTO.orderType,
      shippingCondition: orderDetailTO.transport,
      fromId,
      toId,
      incoterm: orderDetailTO.incoterm || '-',
    };
  }

  private orderDetailToContractInfoCharacteristics(orderDetail: FlorderDetail): ContractInfoCharacteristics {
    const fromId = orderDetail.deliveryMethod.shippingCondition.id === 'Z1' && orderDetail.deliveryMethod.type === 'EPS-CUS' ? '' : orderDetail.deliveryMethod.from.id;
    const toId = orderDetail.deliveryMethod.shippingCondition.id === 'Z1' && orderDetail.deliveryMethod.type === 'CUS-EPS' ? '' : orderDetail.deliveryMethod.to.id;
    return {
      fromId,
      toId,
      type: 'ORDER',
      orderType: orderDetail.deliveryMethod.type,
      shippingCondition: orderDetail.deliveryMethod.shippingCondition.id,
      incoterm: orderDetail.deliveryMethod.incoterm && orderDetail.deliveryMethod.incoterm.id || '-',
    };
  }

  showWarning(titleCode: string, messageCode: string) {
    this.store.dispatch(new ShowNotificationAction({
      titleCode,
      messageCode,
      disableClose: false,
      modal: true,
      subMessages: [],
      type: 'error',
    }));
  }
}
