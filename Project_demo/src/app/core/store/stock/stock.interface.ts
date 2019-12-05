import { Place } from '../florders/place.interface';

export interface Stock {
  items: StockItem[];
  loading: boolean;
  loaded: boolean;
  totalItems: number;
  location: Place;
  powerBIConfig: PowerBIConfig;
}

export interface StockItem {
  packingId: string;
  packingName?: string;
  amount: number;
}

export interface PowerBIConfig {
  loading: boolean;
  loaded: boolean;
  id: string,
  embedUrl: string,
  embedToken: {
    token: string,
    tokenId: string,
    expiration: string
  },
  minutesToExpiration: number,
  isEffectiveIdentityRolesRequired: boolean,
  isEffectiveIdentityRequired: boolean,
  enableRLS: boolean,
  username: string,
  roles: string,
  errorMessage: string
}
