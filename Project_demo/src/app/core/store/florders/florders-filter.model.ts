import { FlordersFilter } from './florders-filter.interface';
import { AppSettings } from '../../../app.settings';
import * as moment from 'moment';

const twoWeeksAgo = moment();
twoWeeksAgo.subtract(2, 'weeks');
const twoWeeksAgoString = twoWeeksAgo.format(AppSettings.DATE_FORMAT_MOMENT_REST);

export const initialStateFlordersFilter: FlordersFilter = {
  orderTypes: [],
  flowTypes: [],
  florderDateFrom: twoWeeksAgoString,
  florderDateTo: null,
  unloadingDateFrom: null,
  unloadingDateTo: null,
  orderStatus: null,
  sealNumber: '',
  customers: null,
  ccrYes: false,
  ccrNo: false,
  palletIds: [],
  packingIds: [],
  customerReferenceNumber: '',
  senderReferenceNumber: '',
  salesOrderNumber: '',
  etmDocumentNumber: '',
  etmShippingNumber: '',
  transporter: '',
  froms: [],
  tos: [],
  shipTos: [],
  shippingCondition: 'all',
  incoterms: [],
  statusHandshake: false,
  statusDefinitive: false,
  statusCancel: false,
  differenceYes: true,
  differenceNo: true,
  clearingYes: true,
  clearingNo: true,
  handshakeDateFrom: '',
  handshakeDateTo: '',
  checkedYes: true,
  checkedNo: true,
  flowStatuses:[],
  orderStatuses:[],

  moreSearchOptions: false,

  pageNr: 1,
  pageSize: AppSettings.PAGE_SIZE,
  sortField: '',
  sortAscending: true
};
