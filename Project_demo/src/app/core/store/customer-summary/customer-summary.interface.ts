import { Definition } from '../definitions/definition.interface';

export interface CustomerSummary {
  loading?: boolean;
  loaded?: boolean;
  outdated?: boolean;
  depot?: {
    id: string;
    name: string;
    address: {
      street: string;
      houseNumber: string;
      postcode: number;
      city: string;
      country: string;
    }
    openingHours: {
      Day: {
        weekday: string;
        Morning?: {from: string, to: string};
        Afternoon?: {from: string, to: string};
      }
    }[]
  };
  loadingLatestFlows?: boolean;
  latestFlows?: {
    etmOrderNumber: string;
    salesOrderNumber: string;
    deliveryNumber: string;
    shipmentNumber: string;
  }[];
  loadingLatestOrders?: boolean;
  latestOrders?: {
    etmOrderNumber: string;
    salesOrderNumber: string;
    deliveryNumber: string;
    shipmentNumber: string;
  }[];
  openHandshakes?: {
    openHandshakeTotal: number;
    flows: {
      etmOrderNumber: string;
      salesOrderNumber: string;
      deliveryNumber: string;
      shipmentNumber: string;
    }[]
  };
  shipTos: Definition[];

  loadingStockOverview?: boolean;
  stockOverview?: {
    packingAmount: number;
    palletAmount: number;
  };

  salesOrganisation?: {
    id: string;
    emailAddress: string;
    phoneNumber: string;
  };
}

export interface CustomerSummaryMW {
  loading?: boolean;
  loaded?: boolean;
  depot?: {
    id: string;
    name: string;
    address: {
      street: string;
      houseNumber: string;
      postcode: number;
      city: string;
      country: string;
    }
    openingHours: {
      Day: {
        weekday: string;
        Morning?: {from: string, to: string};
        Afternoon?: {from: string, to: string};
      }
    }[]
  };
  latestFlows?: {
    EtmOrderNumber: string;
    SalesOrderNumber: string;
    DeliveryNumber: string;
    ShipmentNumber: string;
  }[];
  latestOrders?: {
    EtmOrderNumber: string;
    SalesOrderNumber: string;
    DeliveryNumber: string;
    ShipmentNumber: string;
  }[];
  openHandshakes?: {
    OpenHandshakeTotal: number;
    OpenHandshakes: {
      EtmOrderNumber: string;
      SalesOrderNumber: string;
      DeliveryNumber: string;
      ShipmentNumber: string;
    }[]
  };

  stockOverview?: {
    PackingAmount: number;
    PalletAmount: number;
  };

  salesOrganisation?: {
    id: string;
    emailAddress: string;
    phoneNumber: string;
  };

  shipTos: {[key: string]: string};

}
