import {Component, HostBinding} from '@angular/core';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {FlowSandbox} from 'app/core/sandboxes/flow.sandbox';
import {Definition} from 'app/core/store/definitions/definition.interface';
import {FilterValues} from 'app/core/store/florders/filtervalues.interface';
import {EditFlowDetail} from 'app/core/store/flow-detail/flow-detail.interface';
import {fadeInAnimation} from '../../../animations';
import {AzureMonitoringService} from '../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import {Florder} from '../../../core/store/florders/florder.interface';
import {Florders} from '../../../core/store/florders/florders.interface';
import * as flowDetailActions from '../../../core/store/flow-detail/flow-detail.actions';
import {FlowEdit} from '../../../core/store/flows/flow-edit.interface';
import * as actions from '../../../core/store/flows/flows.actions';
import {util} from '../../../core/util/util';
import {FlorderPageContainer} from '../../florders/florder-page-container/florder-page.container';

@Component({
  selector: 'app-flow-page',
  templateUrl: './flow-page.container.html',
  styleUrls: [
    '../../florders/florder-page-container/florder-page.container.less',
  ],
  animations: [fadeInAnimation],
  // host: { '[@fadeInAnimation]': '' }
  //  animations: [slideInDownAnimation]
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowPageContainer extends FlorderPageContainer {
  flows: Florders;
  loading: boolean = false;
  handshaking: boolean = false;
  filterValues: FilterValues;

  @HostBinding('@fadeInAnimation') fadeInAnimation = true;

  constructor(
    store: Store<fromRoot.RootState>,
    azureMonitoringService: AzureMonitoringService,
    private sandbox: FlowSandbox,
  ) {
    super(store, azureMonitoringService);
    store.select('flows').takeWhile(() => !this.destroyed).subscribe((flows: Florders) => {
      this.flows = flows;
      this.filter = util.deepCopy(flows.filter); // We will change this object, so we need a clone
      this.totalItems = flows.totalItems;
      this.flordersAreLoading = flows.loading;
      this.isDownloading = flows.downloading;
      this.handshaking = flows.handshaking;
      this.filterValues = flows.filterValues;
    });
    store.select('editFlowDetail').takeWhile(() => !this.destroyed).subscribe((editFlowDetail: EditFlowDetail) => {
      this.loading = editFlowDetail && editFlowDetail.mode && editFlowDetail.mode.loading;
    });
    store.map(state => state.contractInfo.failed).takeWhile(() => !this.destroyed).distinctUntilChanged().subscribe(failed => {
      if (failed) {
        this.loading = false;
      }
    });
    store.takeWhile(() => !this.destroyed).map(state => state.customerInfo).distinctUntilChanged()
      .subscribe(customerInfo => {
        this.shipTos = customerInfo.shipTos;
      });

  }

  protected reload(): void {
    this.store.dispatch(new actions.FlowsLoadAction({filter: this.filter}));
  }

  createFlorder(): void {
    if (this.authorization.FLOW.CREATE) {
      this.store.dispatch(go(['/flows/new', {back: 'flows'}]));
    }
  }

  openFlow(florder: Florder): void {
    if (this.authorization.FLOW.GET) {
      let params;
      if (florder.salesOrderNumber) {
        params = {salesOrderNumber: florder.salesOrderNumber, back: 'flows'};
      } else {
        params = {back: 'flows'};
      }
      this.store.dispatch(go([`/flows/${florder.etmOrderNumber}`, params]));
    }
  }

  /**
   * Accept the flow, 1 button click.  Use the filled in quantities
   * @param {Florder} flow
   */
  acceptFlow(flow: Florder) {
    this.store.dispatch(new actions.FlowsAcceptFlowStartAction({flow}));
  }

  cancelFlow(flow: Florder) {
    this.store.dispatch(new actions.FlowsCancelFlowStartAction({flow}));
  }

  downloadList(exportType: string): void {
    this.store.dispatch(new actions.FlowsDownloadAction({exportType, filter: this.filter, totalItems: this.totalItems}));
  }

  downloadDocument(flow: Florder): void {
    this.store.dispatch(new flowDetailActions.FlowDetailDocumentDownloadAction({etmOrderNumber: flow.etmOrderNumber, extension: 'PDF'}));
  }

  copyFlow(flow: Florder): void {
    this.sandbox.copyFlow(flow.etmOrderNumber);
  }

  editFlow(flow: Florder): void {
    this.loading = true;
    this.store.dispatch(go([`/flows/${flow.etmOrderNumber}/edit`]));
  }

  /**
   * Go to edit flow in 'accept' or 'handshake' modus
   * @param {Florder} flow
   */
  editAcceptFlow(flow: Florder): void {
    this.loading = true;
    this.store.dispatch(go([`/flows/${flow.etmOrderNumber}/accept`]));
  }

  validateEditFields(flowEdits) {
    let isValid: boolean = true;
    let invalidFlows: String[] = [];
    let localIsInvalid: boolean = true;
    flowEdits.map(flow => {
      if (flow.checked) {
        flow.items.map(item => {
          localIsInvalid = !isNaN(item.quantity) && item.quantity !== '' ? true : false;
        });
        if (!localIsInvalid) {
          invalidFlows.push(flow.etmOrderNumber);
        }
        isValid = localIsInvalid;
      }
    });
    return {
      valid: isValid,
      invalidFlows: invalidFlows,
    };
  }

  acceptFlows(flowEditArray: FlowEdit[]) {
    let flows = flowEditArray.filter(flowEdit => flowEdit.checked).map(flowEdit => {
      const flow: Florder = {
        ...flowEdit.flow,
        flowLineItems: flowEdit.flow.flowLineItems.map(item => {
          const edited = flowEdit.items.find(i => i.itemNumber === item.itemNumber);
          return {
            ...item,
            originalQuantity: edited.originalQuantity,
            definitiveQuantity: edited.definitiveQuantity
          };
        })
      };
      return flow;
    });


    // send rest call with delays
    const doRestCall = () => {
      this.sandbox.acceptFlow(flows.pop());
      if (flows.length) {
        window.setTimeout(doRestCall, 100);
      }
    };

    doRestCall();
  }
}
