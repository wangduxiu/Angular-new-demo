import { RecurrenceDate } from 'app/core/store/order-detail/order-detail.interface';
import { CCREditMaterialLine } from '../ccr-detail/ccr-detail.interface';
import { Definition } from '../definitions/definition.interface';
import { Place } from '../florders/place.interface';

// INTERFACES *********

export interface DeliveryMethod {
  type: string;
  soldTo: Place;
  shippingCondition: Definition;
  to: Place;
  from: Place;
  incoterm: Definition;
  customerReferenceNumber: string;
  senderReferenceNumber: string;
  transporter: string;
  licensePlate: string;
  remarks: string;
  remarksHandshaker: string;
  sealNumber?: string;
  clearing?: boolean;
  wholesaler?: Place;
}

export interface Materialish {
  internalId?: number;
  type: 'combination' | 'packing' | 'pallet';
  palletId: string;
  packingId: string;
  packingStatus: string;
  logisticsVarietyPacking: string;
}

export interface Material extends Materialish {
  packingsPerPallet: string;
  numberOfPallets: string;
  requestedBalance?: string;
  packingQuantity: string;
  poNumberItemLevel: string;
  poItemNumber: string;
  contentId: string;
  lineReferenceId: string;
  isNew: boolean;
}

export interface Planning {
  loadingDate: string | string[];
  unloadingDate: string | string[];
  exchangePallets?: boolean;
  numberOfExchangePallets?: number;
  maxAmountOfPalletExchangeAvailable?: number;
  orderDate?: string;
  flowDate?: string;
  recurrence: {
    active: boolean;
    pattern: 'monthly' | 'weekly';
    endDate: string;
    weekly: {
      monday?: boolean;
      tuesday?: boolean;
      wednesday?: boolean;
      thursday?: boolean;
      friday?: boolean;
      saturday?: boolean;
      sunday?: boolean;
    };
    monthly: {
      monthlyRecurrencyType: 'nrOfDay' | 'whichDay';
      day: number;
      monthPeriodicy1: number;
      monthPeriodicy2: number;
      which: 'FIRST' | 'SECOND' | 'THIRD' | 'FOURTH' | 'LAST';
      weekday:
        'MONDAY'
        | 'TUESDAY'
        | 'WEDNESDAY'
        | 'THURSDAY'
        | 'FRIDAY'
        | 'SATURDAY'
        | 'SUNDAY';
    };
  };
}

export interface FlorderDetail {
  status: string;
  deliveryMethod: DeliveryMethod;
  materials: Material[];
  createTemplate: boolean;
  templateId?: string;
  templateName: string;
  planning: Planning;
  etmOrderNumber: string;
  salesOrderNumber: string;
  deliveryNumber: string;
  shipmentNumber: string;
  sealNumber: string;
  registeredBy: string;
  fullTruck: boolean;
  palletQuantity: number;
  globalType: string;
  handshaker?: boolean;
  registrar?: boolean;
  lateHandshake?: boolean;
  updateTime: string;
  updateDate: string;
  updateBy: string;
  isLocked?: boolean;
  flowDateError?: string;
  ccr?: {
    ccrNumber: string;
    sealNumber: string;
    open: boolean;
    accepted: boolean;
    declined: boolean;
    ccrLineItems: CCREditMaterialLine[];
  };
  documents?: OrderDocument[];
}

export interface AvailablePickingDates {
  full: string[];
  nonFull: string[];
}

export interface EditFlorderDetail {
  mode: {
    type: 'flow' | 'order' | 'ccr',
    state: 'create' | 'view' | 'create-confirm' | 'edit' | 'edit-confirm' | 'recurrence-dates',
    editWindow: 'delivery' | 'detail' | 'planning',
    openingWindow?: 'delivery' | 'detail' | 'planning',
    createTemplate: boolean,
    editTemplate: boolean,
    material?: Material,
    loading: boolean,
    loadSuccess: boolean,
    saving: boolean,
    saveSuccess: boolean,
    saved: boolean,
    datesLoading: boolean
  };
  availablePickingDates: AvailablePickingDates;
}

export interface FlorderDetailTO {
  comments: string;
  confirmedLoadingDate: string;
  confirmedUnloadingDate: string;
  customerRefNumber: string;
  senderRefNumber: string;
  deliveryDateChanged: boolean;
  deliveryNumber: any;
  depotChanged: boolean;
  etmOrderNumber: string;
  exchangePallets: any;
  numberOfExchangePallets: number;
  from: {
    id: string;
    name: any;
    address?: any;
    closingTime?: any;
    openTime?: any;
    openingHours?: any;
  };
  globalType: string;
  invoiceNumber: any;
  isLocked: boolean;
  licensePlate: string;
  packingChanged: boolean;
  purchaseOrderType: any;
  quantityChanged: boolean;
  registeredBy: any;
  requestedLoadingDate: any;
  requestedUnloadingDate: string;
  salesOrderNumber: string;
  shipmentNumber: any;
  soldTo: {
    id: string;
    name: any;
  };
  to: {
    id: string;
    name: any;
    address?: any;
    closingTime?: any;
    openTime?: any;
    openingHours?: any;
  };
  transport: string;
  transporter: any;
  updateBy: string;
  updateDate: string;
  updateTime: string;
}

export interface OrderDetailTO extends FlorderDetailTO {
  orderType: string;
  orderDate: string;
  orderStatus: any;
  incoterm?: string;
  lineItems: {
    itemNumber: number;
    logisticsVarietyPacking: string;
    numberOfPallets: number;
    packingId: string;
    packingQuantity: number;
    packingStatus: string;
    packingsPerPallet: number;
    palletId: string;
    palletStatus: string;
  }[];
  ccr: {
    ccrNumber: string;
    sealNumber: string;
    approved: string;
    ccrLineItems: {
      itemNo: string;
      changeType: string;
      lineType: string;
      palletId: string;
      packingId: string;
      palletStatus: string;
      packingStatus: string;
      logisticsVarietyPacking: string;
      packingsPerPallet: string;
      noOfPallets: string;
      packingQuantity: string;
      noExchangePallet: string;
    }[];
  };
  documents: OrderDocument[];
}

export interface FlowDetailTO extends FlorderDetailTO {
  flowType: string;
  flowDate: string;
  clearing: string;
  handshakeDate: string;
  handshakeStatus: string;
  wholeSalerId: string;
  handshakeComments: string;
  flowLineItems: {
    itemNumber: number;
    logisticsVarietyPacking: string;
    packingId: string;
    packingStatus: string;
    contentId: string;
    lineReferenceId: string;
    originalQuantity: number;
    definitiveQuantity: number;
    differenceQuantity: number;
  }[];
}

export interface CalculatedTruckLoad {
  orderLineInfo: {
    orderLines: {
      itemNumber: number;
      quantity: string;
    }[];
    quantity: string;
    maxAmountOfPalletExchangeAvailable: number;
    fullTruck: boolean;
    loadedEpp: number;
    maxEpp: number;
  };
  message: {
    description: string;
    type: string;
  };
}

export interface OrderDocument {
  documentId: string;
  extension: string;
  fileName: string;
  mimeType: string;
  type: string;
}

export interface HasRecurrenceDates {
  recurrenceDates?: RecurrenceDate[];
}
