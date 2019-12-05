import {Component, OnInit} from '@angular/core';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {InvoiceSandbox} from 'app/core/sandboxes/invoice.sandbox';
import {AzureMonitoringService} from 'app/core/services/AzureMonitoringService';
import {BaseContainer} from 'app/modules/base/BaseContainer';
import {fadeInAnimation} from '../../../animations';
import {Invoice, InvoiceFilter, Invoices} from '../../../core/model/Invoice.interface';
import * as fromRoot from '../../../core/store';
import {AuthorizationMatrix} from '../../../core/store/contract-details/contract-details.interface';
import {Definition} from '../../../core/store/definitions/definition.interface';
import {Place} from '../../../core/store/florders/place.interface';

@Component({
  selector: 'app-invoices-page-container',
  templateUrl: './invoices-page-container.component.html',
  styleUrls: ['./invoices-page-container.component.less'],
  animations: [fadeInAnimation],
})
export class InvoicesPageContainer extends BaseContainer implements OnInit {

  places: Place[];
  invoiceTypes: Definition[];
  invoices: Invoices;
  authorization: AuthorizationMatrix;
  localCurrency: string;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, private sandbox: InvoiceSandbox) {
    super(store, azureMonitoringService);

    sandbox.invoiceTypes$.takeWhile(() => !this.destroyed).subscribe((invoiceTypes: Definition[]) => this.invoiceTypes = invoiceTypes);
    sandbox.invoices$.takeWhile(() => !this.destroyed).subscribe((invoices: Invoices) => this.invoices = invoices);
    sandbox.soldToOptions$.takeWhile(() => !this.destroyed).subscribe((places: Place[]) => this.places = places);
    sandbox.authorization$.takeWhile(() => !this.destroyed).subscribe((authorization: AuthorizationMatrix) => this.authorization = authorization);
    sandbox.localCurrency$.takeWhile(() => !this.destroyed).subscribe((localCurrency: string) => this.localCurrency = localCurrency);
  }

  ngOnInit() {
  }

  filterInvoices(invoiceForm: InvoiceFilter) {
    this.sandbox.loadInvoices({
      ...invoiceForm,
      pageNr: this.invoices.filter.pageNr
    });
  }

  changePage(pageNr: number): void {
    this.sandbox.loadInvoices({
      ...this.invoices.filter,
      pageNr
    });
  }

  onItemsPerPageChange(pageSize: number) {
    this.sandbox.loadInvoices({
      ...this.invoices.filter,
      pageSize
    });
  }

  sortChange({ sortField, sortAscending }) {
    this.sandbox.loadInvoices({
      ...this.invoices.filter,
      sortField,
      sortAscending
    });
  }

  downloadInvoice(invoice: Invoice): void {
    if (this.authorization.INVOICES.GET_INVOICE_DOCUMENT && !this.invoices.downloading) {
      this.sandbox.downloadInvoice(invoice);
    }
  }

  downloadList(): void {
    if (this.authorization.INVOICES.GET_INVOICE_DOCUMENT && !this.invoices.downloading) {
      this.sandbox.downloadList();
    }
  }

  openDescartesInvoices() {
    this.store.dispatch(go(['/descartes-invoices']));
  }


}
