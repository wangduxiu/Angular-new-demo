export interface FlordersFilter {
  orderTypes?: string[];
  flowTypes?: string[];
  florderDateFrom?: string;
  florderDateTo?: string;
  unloadingDateFrom?: string;
  unloadingDateTo?: string;
  orderStatus?: Object;
  sealNumber?: string;
  ccrYes?: boolean;
  ccrNo?: boolean;
  palletIds?: string[];
  packingIds?: string[];
  customerReferenceNumber?: string;
  senderReferenceNumber?: string;
  salesOrderNumber?: string;
  etmShippingNumber?: string;
  etmDocumentNumber?: string;
  transporter?: string;
  customers?: string[];
  shippingCondition?: string;
  froms?: string[];
  tos?: string[];
  depots?: string[];
  incoterms?: string[];
  shipTos?: string[];
  statusHandshake?: boolean;
  statusDefinitive?: boolean;
  statusCancel?: boolean;
  differenceYes?: boolean;
  differenceNo?: boolean;
  clearingYes?: boolean;
  clearingNo?: boolean;
  handshakeDateFrom?: string;
  handshakeDateTo?: string;
  checkedYes?: boolean;
  checkedNo?: boolean;
  flowStatuses?: string[];
  orderStatuses?: string[];

  moreSearchOptions?: boolean;

  pageNr?: number;
  pageSize?: number;
  sortField?: string;
  sortAscending?: boolean;
}
