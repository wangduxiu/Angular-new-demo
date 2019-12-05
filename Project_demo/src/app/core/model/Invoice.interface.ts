export interface InvoiceFromMW {
  soldTo: string;
  invoiceNumber: string;
  type: string;
  invoiceDate: string;
  netAmount: number;
  currency: string;
  totalAmount: number;
  vat: number;
}

export interface InvoicesFromMW {
  items: InvoiceFromMW[];
  totalItems: number;
}

export interface Invoice extends InvoiceFromMW{

}

export interface InvoiceFilter {
  currency?: string[];
  euro?: boolean;
  invoiceDateFrom?: string | [string];
  invoiceDateTo?: string | [string];
  invoiceNumber?: string | [string];
  localCurrency?: boolean | [string];
  netAmountFrom?: string;
  netAmountTo?: string;
  soldTo?: string | [string];
  type?: string | [string];

  pageNr: number;
  pageSize: number;
  sortField: string;
  sortAscending: boolean;
}

export interface Invoices {
  items: Invoice[];
  filter: InvoiceFilter;
  totalItems: number;
  loading: boolean;
  loaded: boolean;
  downloading: boolean;
  descartes: {
    url: string;
    loading: boolean;
    loadSuccess: boolean;
  }
}

export interface Currency {
  id: string;
  name: string;
  checked: boolean;
}
