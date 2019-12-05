import { CustomerSummary } from './customer-summary.interface';

export const initialCustomerSummary: CustomerSummary = {
  loading: false,
  loaded: true,
  depot: {
    id: null,
    name: null,
    address: {
      street: null,
      houseNumber: null,
      postcode: null,
      city: null,
      country: null
    },
    openingHours: []
  },
  latestFlows: [],
  latestOrders: [],
  openHandshakes: {
    openHandshakeTotal: 0,
    flows: []
  },
  stockOverview: {
    packingAmount: 0,
    palletAmount: 0
  },
  salesOrganisation: {
    id: '',
    emailAddress: '',
    phoneNumber: ''
  },
  shipTos: []
};
