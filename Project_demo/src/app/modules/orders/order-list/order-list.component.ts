import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CcrLineItem, Florder } from '../../../core/store/florders/florder.interface';
import { AppSettings } from '../../../app.settings';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { AuthorizationMatrix, ContractRestrictions } from '../../../core/store/contract-details/contract-details.interface';
import { util } from '../../../core/util/util';
import { Definition } from '../../../core/store/definitions/definition.interface';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { FlordersFilter } from '../../../core/store/florders/florders-filter.interface';

interface OrderEdit {
  id: string;
  etmOrderNumber: string;
  salesOrderNumber: string;
  customerReferenceNumber: string;
  fromId: string;
  toId: string;
  checked: boolean;
  collapsed: boolean;
  statusId: string;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['../../florders/florder-list/florder-list.less', './order-list.component.less']
})
export class OrderListComponent implements OnInit, OnChanges {

  private initialized = false;
  private orderEdits: { [key: string]: OrderEdit } = {};

  dateFormat: string = AppSettings.DATE_FORMAT_ANGULAR;
  showAll: boolean = false;

  @Input() orders: Florder[];
  @Input() readonly definitions : Definitions;
  @Input() isLoading: boolean;
  @Input() isDownloading: boolean;
  @Input() filter: FlordersFilter;
  @Input() totalItems:number;
  @Input() authorization: AuthorizationMatrix;
  @Input() restrictions: ContractRestrictions;

  @Output() downloadFile:EventEmitter<string> = new EventEmitter();
  @Output() openOrder:EventEmitter<Florder> = new EventEmitter();
  @Output() pageChange:EventEmitter<number> = new EventEmitter();
  @Output() sortChange:EventEmitter<{sortField: string, sortAscending: boolean}> = new EventEmitter();
  @Output() copyOrder:EventEmitter<string> = new EventEmitter();
  @Output() createCCR:EventEmitter<Florder> = new EventEmitter();
  @Output() asTemplate:EventEmitter<Florder> = new EventEmitter();
  @Output() acceptDeviation:EventEmitter<string> = new EventEmitter();
  @Output() rejectDeviation:EventEmitter<string> = new EventEmitter();
  @Output() downloadDocument:EventEmitter<string> = new EventEmitter();
  @Output() downloadCCRDocument:EventEmitter<string> = new EventEmitter();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  constructor(private simplePageScrollService: SimplePageScrollService) {
  }

  ngOnInit(): void {
    this.initialized = true;
    this.updateChecks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.orders) {
      this.updateChecks();
    }
  }

  /**
   * Update form objects for the current subset of orders shown. Use already stored data from previous edit actions for current query
   * formEdit => formGroup controls
   */
  updateChecks() {
    this.orders.forEach(order => {
      const id = `${order.etmOrderNumber}-${order.salesOrderNumber}`;
      let orderEdit: OrderEdit = this.orderEdits[id];
      if (!orderEdit) {
        orderEdit = {
          id,
          etmOrderNumber: `${order.etmOrderNumber}`,
          salesOrderNumber: `${order.salesOrderNumber}`,
          customerReferenceNumber: order.customerRefNumber, // TODO is this needed ?
          fromId: order.from.id,
          toId: order.to.id,
          checked: false,
          collapsed: !this.showAll,
          statusId: order.status && (order.status as Definition).id
        } as OrderEdit;
        this.orderEdits[id] = orderEdit;
      }
    });
  }

  onPageChange(pageNr) {
    this.pageChange.emit(pageNr);
    this.simplePageScrollService.scrollToElement('#top', 0);
  }

  /**
   * Check if flow is collapsed or not
   * @param {string} etmOrderNumber of order to check. Order shall always exist in orderEdit object since that object is created by updateChecks (when order is set)
   * @returns {boolean} collapsed or not
   */
  isCollapsed(etmOrderNumber: string, salesOrderNumber: string): boolean {
    const id = `${etmOrderNumber}-${salesOrderNumber}`;
    return this.orderEdits[id].collapsed;
  }

  /**
   * set collapsed boolean to other value
   * @param {string} etmOrderNumber of order to check. Order shall always exist in orderEdit object since that object is created by updateChecks (when order is set)
   * @returns {boolean} collapsed or not
   */
  toggleCollapsed(etmOrderNumber: string, salesOrderNumber: string): boolean {
    const id = `${etmOrderNumber}-${salesOrderNumber}`;
    return (this.orderEdits[id].collapsed = !this.orderEdits[id].collapsed);
  }

  toggleCollapseAll() {
    Object.keys(this.orderEdits).map(key => this.orderEdits[key]).forEach(orderEdit => (orderEdit.collapsed = this.showAll));
    this.showAll = !this.showAll;
  }

  sort(field: string) {
    util.sortHelper(this, field);
  }

  sortBnd = this.sort.bind(this);

  preventRouting(event) {
    event.stopPropagation();
  }

  openMenu(event) {
    event.stopPropagation();
  }

  acceptDeviationClicked($event, order: Florder) {
    this.preventRouting($event);
    if (!order.ccr.UI.submittingAccept && !order.ccr.UI.submittingReject) {
      this.acceptDeviation.emit(order.ccr.ccrNumber);
    }
  }

  rejectDeviationClicked($event, order: Florder) {
    this.preventRouting($event);
    if (!order.ccr.UI.submittingAccept && !order.ccr.UI.submittingReject) {
      this.rejectDeviation.emit(order.ccr.ccrNumber);
    }
  }

  getLoadedQuantity(ccrLine: CcrLineItem) {
    if (ccrLine.loaded) {
      return ccrLine.loaded.packingQuantity || ccrLine.loaded.numberOfPallets;
    }
  }

  getUnloadedQuantity(ccrLine: CcrLineItem) {
    if (ccrLine.unloaded) {
      return ccrLine.unloaded.packingQuantity || ccrLine.unloaded.numberOfPallets;
    }
  }

  getDifference(ccrLine: CcrLineItem) {
    if (ccrLine.difference) {
      return ccrLine.difference.packingQuantity || ccrLine.difference.numberOfPallets;
    }
  }

  showCcrButtons(order: Florder) {
    const statusId: string = typeof order.status === 'string' ? order.status as string : (order.status as Definition).id;
    return this.authorization.ORDER.CREATE && order.ccr.open && (statusId === '07' || statusId === '08');
  }

  canCreateCcr(order: Florder) {
    return order.canCreateCcr && this.authorization.ORDER.CREATE;
    // const statusId: string = typeof order.status === 'string' ? order.status as string : (order.status as Definition).id;
    // return this.restrictions.useCcrValidation && !order.ccr.ccrNumber && (statusId === '07' || statusId === '08') && order.orderType === 'CUS-EPS';
  }
}
