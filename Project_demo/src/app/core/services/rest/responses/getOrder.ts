import { OrderDetailTO } from '../../../store/florder-detail/florder-detail.interface';

export default {
  soldTo:{
    id:'0001000140',
    name:'Aardappelhandel De Rop N.V.'
  },
  orderDate:'2017-09-28',
  etmOrderNumber:'0100003696',
  senderRefNumber:'0100003696',
  salesOrderNumber:'0200001077',
  deliveryNumber:null,
  shipmentNumber:null,
  invoiceNumber:null,
  from:{
    id:'BE11_001',
    name:'Katelijne'
  },
  to:{
    id:'0002000220',
    name:'Aardappelhandel De Rop N.V.'
  },
  requestedLoadingDate:null,
  confirmedLoadingDate:null,
  requestedUnloadingDate:'2017-09-29',
  confirmedUnloadingDate:'2017-09-29',
  transport:'Z2',
  purchaseOrderType:'MAIL',
  globalType:'OUT',
  orderType:'EPS-CUS',
  orderStatus:'01',
  transporter:null,
  licensePlate:null,
  customerRefNumber:'Test',
  exchangePallets:false,
  numberOfExchangePallets: 0,
  comments:'                                                                                                                                                                                                                                                               ',
  lineItems:[
    {
      itemNumber:100,
      palletId:'000000000031000004',
      packingId:'000000000021000002',
      palletStatus:'UP',
      packingStatus:'20',
      logisticsVarietyPacking:'I',
      packingsPerPallet:304,
      numberOfPallets:4,
      packingQuantity:1216
    }
  ],
  numberOfPFQsEuro:null,
  numberOfPFQsPool:null,
  updateDate:'2017-09-28',
  updateTime:'10:38:50',
  updateBy:'PRO_DEV',
  isLocked:true,
  registeredBy:null,
  depotChanged:null,
  deliveryDateChanged:null,
  quantityChanged:null,
  packingChanged:null,
  ccr:{
    ccrNumber:null,
    sealNumber:null,
    approved:null,
    ccrLineItems:[

    ]
  },
  documents: []
} as OrderDetailTO;
