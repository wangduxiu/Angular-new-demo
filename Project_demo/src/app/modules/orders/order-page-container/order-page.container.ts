import { Component } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { OrderSandbox } from 'app/core/sandboxes/order.sandbox';
import { FilterValues } from 'app/core/store/florders/filtervalues.interface';
import { fadeInAnimation } from '../../../animations';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import { ContractRestrictions } from '../../../core/store/contract-details/contract-details.interface';
import { Definition } from '../../../core/store/definitions/definition.interface';
import { Florder } from '../../../core/store/florders/florder.interface';
import { Florders } from '../../../core/store/florders/florders.interface';
import * as orderDetailActions from '../../../core/store/order-detail/order-detail.actions';
import * as ordersActions from '../../../core/store/orders/orders.actions';
import { Customer, UserContext } from '../../../core/store/user-context/user-context.interface';
import { util } from '../../../core/util/util';
import { FlorderPageContainer } from '../../florders/florder-page-container/florder-page.container';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.container.html',
  styleUrls: ['../../florders/florder-page-container/florder-page.container.less'],
  animations: [fadeInAnimation],
})
export class OrderPageContainer extends FlorderPageContainer {
  orders: Florders;
  activeCustomer: Definition;
  restrictions: ContractRestrictions;
  userContext: UserContext;
  customers: Customer[] = null;
  isTransporter: boolean;
  private filterValues: FilterValues;

  constructor(
    store: Store<fromRoot.RootState>,
    azureMonitoringService: AzureMonitoringService,
    private sandbox: OrderSandbox
  ) {
    super(store, azureMonitoringService);
    store.select('orders').takeWhile(() => !this.destroyed).subscribe((orders: Florders) => {
      this.orders = orders;
      this.filter = util.deepCopy(orders.filter); // We will change this object
      this.totalItems = orders.totalItems;
      this.flordersAreLoading = orders.loading;
      this.isDownloading = orders.downloading;
      this.filterValues = orders.filterValues;
    });
    store.select('session').takeWhile(() => !this.destroyed).subscribe((session: { userContext: UserContext; activeCustomer: Definition }) => {
      this.activeCustomer = session.activeCustomer;
      this.userContext = session.userContext;
    });
    // store.select('editOrderDetail').takeWhile(() => !this.destroyed).subscribe((editOrderDetail: EditOrderDetail) => {
    //   this.loading = editOrderDetail.mode.loading;
    // });
    store.takeWhile(() => !this.destroyed).map(state => state.customerInfo).distinctUntilChanged()
      .subscribe(customerInfo => {
        this.shipTos = customerInfo.shipTos;
        this.restrictions = customerInfo.restrictions; // used in list: useCcrValidation
      });
    store.takeWhile(() => !this.destroyed).map(state => state.session.userContext).distinctUntilChanged()
      .subscribe(userContext => {
        if (userContext.isTransporter) {
          this.isTransporter = userContext.isTransporter;
          this.customers = userContext.customers;
        } else {
          this.customers = null;
        }
      });
  }

  protected reload(): void {
    this.store.dispatch(new ordersActions.OrdersLoadAction({ filter: this.filter }));
  }

  createFlorder(): void {
    if (this.authorization.ORDER.CREATE) {
      this.store.dispatch(go(['orders/new', { back: 'orders' }]));
    }
  }

  createTemplate(): void {
    if (this.authorization.ORDER.CREATE_TEMPLATE) {
      this.store.dispatch(go(['/orders/template/new', { back: 'orders' }]));
    }
  }

  openOrder(florder: Florder): void {
    if (this.authorization.ORDER.GET) {
      let params;
      if (florder.salesOrderNumber) {
        params = { salesOrderNumber: florder.salesOrderNumber, back: 'orders' };
      } else {
        params = { back: 'orders' };
      }
      this.store.dispatch(go([`orders/${florder.etmOrderNumber}`, params]));
    }
  }

  downloadFile(exportType: string): void {
    if (this.authorization.ORDER.LIST_ORDERS_AS_DOCUMENT) {
      const customerIds = this.isTransporter ? this.customers.map(c => c.id) : [];
      this.store.dispatch(new ordersActions.OrdersDownloadAction({ exportType, filter: this.filter, totalItems: this.totalItems, customerIds }));
    }
  }

  createCCR(order: Florder): void {
    this.store.dispatch(go([`/ccr/${order.etmOrderNumber}`, { salesOrderNumber: order.salesOrderNumber }]));
  }

  copyOrder(order: Florder): void {
    this.sandbox.copyOrder(this.activeCustomer.id, order.etmOrderNumber, order.salesOrderNumber);
  }

  asTemplate(order: Florder): void {
    this.sandbox.createTemplateFromOrder({ etmOrderNumber: order.etmOrderNumber });
  }

  acceptDeviation(ccrNumber: string): void {
    this.store.dispatch(new ordersActions.OrderAcceptDeviationAction({ ccrNumber }));
  }

  rejectDeviation(ccrNumber: string): void {
    this.store.dispatch(new ordersActions.OrderRejectDeviationAction({ ccrNumber }));
  }

  downloadDocument(orderDocumentNumber: string): void {
    this.store.dispatch(new orderDetailActions.OrderDetailDocumentDownloadAction({ documentId: orderDocumentNumber, extension: 'PDF' }));
  }

  downloadCCRDocument(ccrDocumentNumber: string): void {
    this.store.dispatch(new orderDetailActions.OrderDetailCCRDocumentAction({ documentId: ccrDocumentNumber, extension: 'PDF' }));
  }
}
