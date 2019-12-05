import { Definition } from '../definitions/definition.interface';
import { Place } from './place.interface';
import { ErrorMessage } from '../../util/error.interface';

export interface FlowLineItem {
  itemNumber: number;
  packingId: string;
  packingStatus: string;
  originalQuantity: number | string;
  definitiveQuantity: number | string;
  differenceQuantity: number;
  contentId: string;
  lineReferenceId: string;
  isNew: boolean;
}

export interface Quantities {
  numberExchangePallet: number;
  numberOfPallets: number;
  packingQuantity: number;
}

export interface CcrLineItem {
  itemNumber: number;
  packingId: string;
  packingStatus: string;
  logisticsVarietyPacking: string;
  palletId: string;
  palletStatus: string;
  loaded?: Quantities;
  unloaded?: Quantities;
  difference?: Quantities;
}

export interface Florder {
  id: number;
  orderType?: string;
  flowType?: string;
  orderDate?: string;
  flowDate?: string;
  customerRefNumber: string;
  salesOrderNumber: string;
  deliveryNumber: string;
  shipmentNumber: string;
  etmOrderNumber: string;
  senderRefNumber: string;
  from: Place;
  to: Place;
  requestedUnloadingDate: string;
  confirmedUnloadingDate: string;
  incoterm?: string;
  shippingCondition: Definition;
  globalType: string | Definition;
  flowLineItems?: FlowLineItem[];
  status: Definition | string;
  executeHandshake?: boolean;
  editOriginalQuantity?: boolean;
  editDefinitiveQuantity?: boolean;
  canCancel?: boolean;
  blacklisted?: boolean;
  failed?: boolean;
  failMessage?: ErrorMessage;
  updateTime: string;
  updateDate: string;
  updateBy: string;
  transporter?: string;
  clearing?: string;
  licensePlate?: string;
  comments?: string;
  wholesalerId?: string;
  canCreateCcr?: boolean;
  ccr?: {
    UI: {
      submittingAccept: boolean;
      submittingReject: boolean;
    };
    ccrNumber: string;
    sealNumber: string;
    open: boolean;
    accepted: boolean;
    declined: boolean;
    ccrLineItems: CcrLineItem[]
  };
}
export interface FlorderTO {
  id?: number;
  orderType?: string;
  flowType?: string;
  orderDate: string;
  customerRefNumber: string;
  salesOrderNumber: string;
  deliveryNumber: string;
  shipmentNumber: string;
  etmOrderNumber: string;
  senderRefNumber: string;
  handshakeStatus?: string;
  handshakeDate?: string;
  from: Place;
  to: Place;
  requestedUnloadingDate: string;
  confirmedUnloadingDate: string;
  transport: string | Definition;
  incoterm?: string | Definition;
  globalType: string | Definition;
  flowLineItems?: FlowLineItem[];
  orderStatus: string;
  hasChanged: any;
  executeHandshake?: boolean;
  updateTime: string;
  updateDate: string;
  updateBy: string;
  canCreateCcr?: boolean;
  ccr?: {
    ccrNumber: string;
    sealNumber: string;
    approved: string;
    ccrLineItems: CcrLineItem[]
  };
}
