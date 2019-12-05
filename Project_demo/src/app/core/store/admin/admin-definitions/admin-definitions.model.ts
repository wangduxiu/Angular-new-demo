import { AdminDefinitions } from './admin-definitions.interface';

export const initialState: AdminDefinitions = {
  loaded: false,
  role: [],
  salesOrganisation: [],
  customer: [],
  language: [],
};

export interface AdminDefinitionsTO {
  salesOrganisation: { [key: string]: string };
  customer: { [key: string]: string };
  role: { [key: string]: string };
  language: { [key: string]: string };
}
