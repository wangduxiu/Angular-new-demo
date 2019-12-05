import { Definition } from '../definitions/definition.interface';

export interface Service {
  contact: {
    saving: boolean;
    saveSuccess: boolean;
  };
}

export interface ContactItem {
  subject: Definition;
  comments: string;
  soldToName: string;
  vat: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  shipToName: string;
  salesOrder: string;
}
