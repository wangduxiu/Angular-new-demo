export interface AdminDefinition {
  id: string;
  title?: string;
  name?: string; // optional since it's used for contract detail types, types that don't have names yet during the first step of the initialisation
}

export interface AdminDefinitions {
  loaded: boolean;
  role: AdminDefinition[];
  salesOrganisation: AdminDefinition[];
  customer: AdminDefinition[];
  language: AdminDefinition[];
}
