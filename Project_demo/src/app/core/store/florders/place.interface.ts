export interface Address {
  country: string;
  houseNumber?: string;
  street?: string;
  postcode?: string;
  city: string;
}


interface Timespan {
  from: string;
  to: string;
}

interface OpeningHours {
  weekday: string;
  weekdayNr: number;
  slots: Timespan[];
}

export interface Place {
  id: string;
  name: string;
  address?: Address;
  openingHours?: OpeningHours[];
  isDepot?: boolean;
  isLocation?: boolean;
  isCustomer?: boolean;
  default?: boolean;
}

export interface PlaceTO {
  id: string;
  name: string;
  address: {
    street?: string;
    houseNumber?: string;
    houseNo?: string;
    postcode?: number | string;
    city?: string;
    country?: string;
  };
  openingHours: {
    Day?: any
  }[];
  type?: string;
}
