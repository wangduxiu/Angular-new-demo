import { PowerBIConfig, Stock } from './stock.interface';

export const initialPowerBIConfigState: PowerBIConfig = {
  loading: false,
  loaded: false,
  id: null,
  embedUrl: null,
  embedToken: {
    token: null,
    tokenId: null,
    expiration: null
  },
  minutesToExpiration: 0,
  isEffectiveIdentityRolesRequired: false,
  isEffectiveIdentityRequired: false,
  enableRLS: false,
  username: null,
  roles: null,
  errorMessage: null

};

export const initialState: Stock = {
  items: [],
  loading: false,
  loaded: false,
  totalItems: null,
  location: null,
  powerBIConfig: initialPowerBIConfigState
};
