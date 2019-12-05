import { Injectable } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AbstractSandbox } from 'app/core/sandboxes/abstract.sandbox';
import { Observable } from 'rxjs/Observable';
import { Invoice, InvoiceFilter, Invoices, InvoicesFromMW } from '../model/Invoice.interface';
import { AzureMonitoringService } from '../services/AzureMonitoringService';
import { InvoicesRestService } from '../services/rest/invoices.rest.service';
import * as fromRoot from '../store';
import { AdminDefinitions } from '../store/admin/admin-definitions/admin-definitions.interface';
import { AuthorizationMatrix } from '../store/contract-details/contract-details.interface';
import { Definition } from '../store/definitions/definition.interface';
import { Definitions } from '../store/definitions/definitions.interface';
import { ClearInvoicesFilterAction, InvoiceDownloadAction, InvoiceDownloadFailAction, InvoiceDownloadListAction, InvoiceDownloadListFailAction, InvoiceDownloadListSuccessAction, InvoiceDownloadSuccessAction, QueryInvoicesFailAction, QueryInvoicesStartAction, QueryInvoicesSuccessAction } from '../store/invoice/invoice.actions';
import { util } from '../util/util';

@Injectable()
export class InvoiceSandbox extends AbstractSandbox {

  soldToOptions$: Observable<Definition[]> = this.store.select('admin').map((admin: {adminDefinitions: AdminDefinitions}) => admin.adminDefinitions.customer);
  invoices$: Observable<Invoices> = this.store.select('invoice');
  invoiceTypes$: Observable<Definition[]> = this.store.select('definitions').map((definitions: Definitions) => definitions.invoices.invoiceTypes);
  authorization$: Observable<AuthorizationMatrix> = this.store.map(state => state.customerInfo.authorization);
  localCurrency$: Observable<string> = this.store.map(state => state.customerInfo.defaults.localCurrency);

  private authorization: AuthorizationMatrix;

  constructor(store: Store<fromRoot.RootState>, translateService: TranslateService, azureMonitoringService: AzureMonitoringService, private invoicesRestService: InvoicesRestService) {
    super(store, translateService, azureMonitoringService);
    this.authorization$.subscribe(authorization => this.authorization = authorization);
  }

  clearInvoiceFilter(): void {
    this.store.dispatch(new ClearInvoicesFilterAction());
  }

  goToInvoices(): void {
    if (this.authorization && this.authorization.INVOICES.ACCESS)
      this.store.dispatch(go('invoices'));
  }

  loadInvoices(filter: InvoiceFilter): void {
    if (this.authorization && this.authorization.INVOICES.QUERY) {
      this.store.dispatch(new QueryInvoicesStartAction({ filter }));
      this.invoicesRestService
        .getInvoices(filter)
        .subscribe(
          (invoices: InvoicesFromMW) => {
            this.store.dispatch(new QueryInvoicesSuccessAction({ filter, invoices }));
          },
          (error: Error) => {
            const errorMessage = util.getErrorMessage(error);
            if (errorMessage.message === 'Functional SAP Error: No invoices found for given criteria') {
              this.store.dispatch(new QueryInvoicesSuccessAction({
                filter, invoices: {
                  items: [],
                  totalItems: 0
                }
              }));

            } else {
              this.store.dispatch(new QueryInvoicesFailAction({ errorMessage }));
              this.handleFail(errorMessage, 'ERRORS.INVOICE.LOAD');
            }
          });
    }
  }

  downloadInvoice(invoice: Invoice): void {
    if (this.authorization && this.authorization.INVOICES.GET_INVOICE_DOCUMENT) {
      this.store.dispatch(new InvoiceDownloadAction({ invoice }));
      this.invoicesRestService.getInvoiceAsDocument(invoice.invoiceNumber).subscribe(
        (data: any) => {
          const filenameRegexResult = (/filename=([^;]*)/g).exec(data.headers.get('content-disposition'));
          const filename = filenameRegexResult.length && filenameRegexResult[1] || `invoice.pdf`;
          const blob = data._body;
          this.store.dispatch(new InvoiceDownloadSuccessAction({ blob, filename }));
        },
        (error: Error) => {
          this.store.dispatch(new InvoiceDownloadFailAction(error));
          this.handleFail(error, 'ERRORS.INVOICE.DOWNLOAD');
        });
    }
  }

  downloadList(): void {
    if (this.authorization && this.authorization.INVOICES.LIST_INVOICES_AS_DOCUMENT) {

      this.invoices$.take(1).subscribe((invoices: Invoices) => {
        this.store.dispatch(new InvoiceDownloadListAction());
        this.invoicesRestService.getInvoicesAsList(invoices.filter).subscribe(
          (data: any) => {
            const filenameRegexResult = (/filename=([^;]*)/g).exec(data.headers.get('content-disposition'));
            const filename = filenameRegexResult.length && filenameRegexResult[1] || `invoices.pdf`;
            const blob = data._body;
            this.store.dispatch(new InvoiceDownloadListSuccessAction({ blob, filename }));
          },
          (error: Error) => {
            this.store.dispatch(new InvoiceDownloadListFailAction(error));
            this.handleFail(error, 'ERRORS.INVOICE.DOWNLOAD_LIST');
          });
      });
    }
  }
}
