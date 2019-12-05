// INTERFACES *********

import { AppSettings } from '../../../app.settings';
import { Select } from '../../../shared/form-components/select/select.component';
import { DeliveryMethod, EditFlorderDetail, FlorderDetail, Material, Planning } from './florder-detail.interface';

// INITIAL STATE *********

export const initialStateCombinationMaterial: Material = {
  type: AppSettings.MATERIAL_TYPE_COMBINATION,
  palletId: Select.BLANK,
  packingId: Select.BLANK,
  packingStatus: Select.BLANK,
  logisticsVarietyPacking: Select.BLANK,
  packingsPerPallet: Select.BLANK,
  numberOfPallets: '',
  requestedBalance: '',
  packingQuantity: '',
  poNumberItemLevel: '',
  poItemNumber: '',
  contentId: '',
  lineReferenceId: '',
  isNew: true
};

export const initialStatePackingMaterial: Material = {
  type: AppSettings.MATERIAL_TYPE_PACKING,
  palletId: null,
  packingId: Select.BLANK,
  packingStatus: Select.BLANK,
  logisticsVarietyPacking: Select.BLANK,
  packingsPerPallet: null,
  numberOfPallets: null,
  requestedBalance: '',
  packingQuantity: '',
  poNumberItemLevel: '',
  poItemNumber: '',
  contentId: '',
  lineReferenceId: '',
  isNew: true
};

export const initialStatePlanning: Planning = {
  recurrence: {
    active: false,
    pattern: 'weekly',
    endDate: null,
    weekly: {
      monday: false,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false
    },
    monthly: {
      monthlyRecurrencyType: 'nrOfDay',
      day: 1,
      monthPeriodicy1: 1,
      monthPeriodicy2: 1,
      which: 'FIRST',
      weekday: 'WEDNESDAY'
    }
  },
  exchangePallets: false,
  numberOfExchangePallets: null,
  loadingDate: null,
  unloadingDate: null
};

export const initialStateDeliveryMethod: DeliveryMethod = {
  type: '',
  soldTo: null,
  to: null,
  from: null,
  incoterm: null,
  shippingCondition: null,
  customerReferenceNumber: '',
  senderReferenceNumber: '',
  transporter: '',
  licensePlate: '',
  remarks: '',
  remarksHandshaker: ''
};


export const initialStateFlorderDetail: FlorderDetail = {
  status: '',
  deliveryMethod: initialStateDeliveryMethod,
  planning: initialStatePlanning,
  materials: [],
  createTemplate: false,
  templateName: '',
  etmOrderNumber: '',
  salesOrderNumber: '',
  deliveryNumber: '',
  shipmentNumber: '',
  sealNumber: '',
  registeredBy: '',
  fullTruck: false,
  globalType: null,
  palletQuantity: 0,
  updateTime: '',
  updateDate: '',
  updateBy: '',
  ccr: {
    ccrNumber: '',
    sealNumber: '',
    open: true,
    accepted: false,
    declined: false,
    ccrLineItems: []
  },
  documents: [],
};

export const initialStateEditFlorderDetail: EditFlorderDetail = {
  mode: {
    type: 'order',
    state: 'create',
    editWindow: 'delivery',
    createTemplate: false,
    editTemplate: false,
    openingWindow: null,
    loading: false,
    loadSuccess: false,
    saving: false,
    saveSuccess: false,
    saved: false,
    datesLoading: false
  },
  availablePickingDates: {
    // full: ['2017-07-16', '2017-07-17', '2017-07-18', '2017-07-21', '2017-08-02', '2017-07-31'],
    // nonFull: ['2017-07-16', '2017-07-17', '2017-07-18', '2017-07-21', '2017-08-02', '2017-07-31'],
    full: [],
    nonFull: []
  }
};
