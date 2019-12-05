import {Injectable} from '@angular/core';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {AbstractSandbox} from 'app/core/sandboxes/abstract.sandbox';
import {ContractInfoCharacteristics, ContractInfoService} from 'app/core/services/contract-info.service';
import {FlorderDetail, FlowDetailTO} from 'app/core/store/florder-detail/florder-detail.interface';
import * as flowActions from 'app/core/store/flow-detail/flow-detail.actions';
import {FlowDetailEditAcceptFlow, FlowDetailEditFlow} from 'app/core/store/flow-detail/flow-detail.actions';
import {ShowNotificationAction} from 'app/core/store/notification/notification.actions';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {AzureMonitoringService} from '../services/AzureMonitoringService';
import {FlowRestService} from '../services/rest/flow.rest.service';
import * as fromRoot from '../store';
import {Definitions} from '../store/definitions/definitions.interface';
import {Florder} from '../store/florders/florder.interface';
import * as actions from '../store/flows/flows.actions';

@Injectable()
export class FlowSandbox extends AbstractSandbox {

  constructor(
    store: Store<fromRoot.RootState>,
    translateService: TranslateService,
    azureMonitoringService: AzureMonitoringService,
    private flowRestService: FlowRestService,
    private contractInfoService: ContractInfoService,
  ) {
    super(store, translateService, azureMonitoringService);
  }

  acceptFlow(flow: Florder): void {
    // Change state to 'blacklisted'
    // Do rest call
    // after rest call, do state change to remove from blacklisted
    this.store.dispatch(new actions.FlowsAcceptFlowFromBatchStartAction({ flow }));

    this.store.select('definitions').take(1).subscribe((definitions: Definitions) => {
        const statusses = definitions.flow.status;
        this.flowRestService
          .acceptFlow({
            ...flow,
            comments: null, // The comments will be stored as commentsHandshaker.
          })
          .subscribe(result => {
              let json = JSON.parse(result._body);
              json.status = statusses.find(status => status.id == json.status);
              this.store.dispatch(new actions.FlowsAcceptFlowFromBatchSuccessAction({ flow, status: json.status }));
            },
            error => {
              this.store.dispatch(new actions.FlowsAcceptFlowFromBatchFailAction({ flow, error }));
            }
          );
      }
    );
  }

  loadContractInfoFromFlowTypeToIncoterm(flowTypeId: string, forRegistration: boolean): Observable<void> {
    const subject = new Subject<void>();
    this.contractInfoService.loadContractInfoFromOrderTypeToIncoterm(forRegistration ? 'FLOWR' : 'FLOWH', flowTypeId)
      .subscribe(() => {
        subject.complete();
      });
    return subject;
  }

  loadContractInfoMaterials(params: { orderTypeId: string, fromId: string, toId: string }, forRegistration: boolean): Observable<void> {
    return this.contractInfoService.loadContractInfoMaterials({
      ...params,
      shippingCondition: '-',
      incoterm: '-',
      type: forRegistration ? 'FLOWR' : 'FLOWH'
    });
  }

  openFlow(etmOrderNumber: string, salesOrderNumber: string): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.store.dispatch(new flowActions.FlowDetailOpen({ etmOrderNumber, salesOrderNumber }));
    this.flowRestService.getFlow(etmOrderNumber, salesOrderNumber).subscribe(
      result => {
        this.store.take(1).subscribe(state => {
          this.store.dispatch(new flowActions.FlowDetailOpenSuccess({flowDetail: result, contractInfo: state.contractInfo, customerInfo: state.customerInfo}));
          subject.next(true);
          subject.complete();
        });
      },
      error => {
        this.handleFail(error, 'FLOWS.LIST.LABELS.OPEN_FLOW');
        this.store.dispatch(new flowActions.FlowDetailOpenFail(error));
        subject.error(error);
      });
    return subject;
  }

  copyFlow(etmOrderNumber: string) {
    const subject = new Subject<boolean>();

    this.store.dispatch(new flowActions.FlowDetailCopyFlow({ etmOrderNumber }));

    try {
      this.flowRestService.getFlow(etmOrderNumber, '')
        .subscribe(flow => {
            this.contractInfoService.loadContractInfoAndCheck(this.flowTypeTOToContractInfoCharacteristics(flow, true)).subscribe(
              isValid => {
                if (isValid) {
                  this.store.take(1).subscribe(state => {
                    this.store.dispatch(new flowActions.FlowDetailCopyOpenSuccess({ flowDetail: flow, contractInfo: state.contractInfo, customerInfo: state.customerInfo }));
                    this.store.dispatch(go('/flows/copy'));
                    subject.next(true);
                    subject.complete();
                  });
                } else {
                  this.store.dispatch(new flowActions.FlowDetailCopyOpenNoValidContract());
                  this.handleFail({ messageCode: 'ERRORS.COPY_ORDER.NO_VALID_CONTRACT' }, 'ORDERS.DETAIL.LABELS.COPY_ORDER');
                  subject.next(false);
                  subject.complete();
                }
              }
            );
          }
        );
    } catch (error) {
      this.handleFail(error, 'ORDERS.DETAIL.LABELS.COPY_ORDER');
      this.store.dispatch(new flowActions.FlowDetailCopyOpenFail(error));
      subject.error(error);
    }
    return subject.asObservable();
  }

  /**
   * Registrars can edit their flow.  They need flowRegistrationTypes from contractInfo and can manipulate certain fields and all materials
   * @param etmOrderNumber
   */
  editFlow(etmOrderNumber: string): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.flowRestService.getFlow(etmOrderNumber, '')
      .subscribe(flow => {
          this.contractInfoService.loadContractInfoAndCheck(this.flowTypeTOToContractInfoCharacteristics(flow, true)).subscribe(
            isValid => {
              if (isValid) {
                setTimeout(() => {
                  this.store.take(1).subscribe(state => {
                    this.store.dispatch(new FlowDetailEditFlow({ flowDetail: flow, customerInfo: state.customerInfo, contractInfo: state.contractInfo }));
                    subject.next(true);
                    subject.complete();
                  });
                }, 10); // Just wait a moment so that action is reduced
              } else {
                this.handleFail({ messageCode: 'ERRORS.FLOW.EDIT.CONTRACT_CHANGED' }, 'ERRORS.FLOW.EDIT.TITLE');
                subject.next(false);
                subject.complete();
              }
            }
          );
        }
      );
    return subject.asObservable();
  }

  /**
   * Handshakers can update the flow.  They need flowHandshakeTypes from contractInfo and can manipulate certain fields and all materials (no delete)
   * @param etmOrderNumber
   */
  updateFlow(etmOrderNumber: string): Observable<boolean> {
    const subject = new Subject<boolean>();
    this.flowRestService.getFlow(etmOrderNumber, '')
      .subscribe(flow => {
          this.contractInfoService.loadContractInfoAndCheck(this.flowTypeTOToContractInfoCharacteristics(flow, false)).subscribe(
            isValid => {
              if (isValid) {
                setTimeout(() => {
                  this.store.take(1).subscribe(state => {
                    this.store.dispatch(new FlowDetailEditAcceptFlow({ flowDetail: flow, customerInfo: state.customerInfo, contractInfo: state.contractInfo }));
                    subject.next(true);
                    subject.complete();
                  });
                }, 10); // Just wait a moment so that action is reduced
              } else {
                this.handleFail({ messageCode: 'ERRORS.FLOW.EDIT.CONTRACT_CHANGED' }, 'ERRORS.FLOW.EDIT.TITLE');
                subject.next(false);
                subject.complete();
              }
            }
          );
        }
      );
    return subject.asObservable();
  }

  private flowTypeTOToContractInfoCharacteristics(flowDetailTO: FlowDetailTO, forRegistration: boolean): ContractInfoCharacteristics {
    return {
      type: forRegistration ? 'FLOWR' : 'FLOWH',
      orderType: flowDetailTO.flowType,
      shippingCondition: '-',
      fromId: flowDetailTO.from.id,
      toId: flowDetailTO.to.id,
      incoterm: '-',
    };
  }

  private flowDetailToContractInfoCharacteristics(flowDetail: FlorderDetail, forRegistration: boolean): ContractInfoCharacteristics {
    return {
      type: forRegistration ? 'FLOWR' : 'FLOWH',
      orderType: flowDetail.deliveryMethod.type,
      shippingCondition: '-',
      fromId: flowDetail.deliveryMethod.from.id,
      toId: flowDetail.deliveryMethod.to.id,
      incoterm: '-',
    };
  }

  showWarning(titleCode: string, messageCode: string) {
    this.store.dispatch(new ShowNotificationAction({
      disableClose: false,
      titleCode,
      messageCode,
      modal: true,
      subMessages: [],
      type: 'error',
    }));
  }
}
