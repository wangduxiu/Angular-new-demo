export interface Customer {
  id: string;
  name: string;
  role: string;
  salesOrganization?: string;
}

export interface SalesOrganisation {
  id: string;
  name: string;
  customers: Customer[];
}

export interface UserContext {
  contextLoaded: boolean;
  contextLoading: boolean;
  customersLoaded: boolean;
  customersLoading: boolean;
  authorized?: boolean;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  initials: string;
  language: string;
  customers?: Customer[];
  salesOrganisations?: SalesOrganisation[];
  isEpsUser: boolean;
  isAdmin: boolean;
  isAgent: boolean;
  canRelocate: boolean;
  useEmailActors: boolean;
  isTransporter: boolean;
  showTutorial?: boolean;
  adminRoles: AdminRoles;
}

export interface AdminRoles {
  updateEpsUser: boolean;
  inviteEpsUser: boolean;
  createClientUser: boolean;
  updateClientUser: boolean;
  inviteClientUser: boolean;
  resetPassword: boolean;
  reInvite: boolean;
}

export interface UserContextTO {
  id: string;
  userId: string;
  email?: string;
  initials: string;
  firstName: string;
  lastName: string;
  language: string;
  activeCustomerId: string;
  activeCustomerName: string;
  activeRole: string;
  activeDirectoryGroups: any;
  adminRoles: AdminRoles;
  salesOrganisations?: {
    [key:string]: string;
  };
  customers?: {
    [key:string]: {
      name: string;
      roleId: string;
    }
  };
  userType: string;
  isAdmin?: boolean;
  isAgent?: boolean;
  canRelocate?: boolean;
  useEmailActors?: boolean;
  isTransporter?: boolean;
  showTutorial?: boolean;
}


export interface CustomerTO {
  customerNumber: string;
  customerName: string;
  salesOrganization: string;
  salesOffice: any;
  address: any;
}

export interface CustomersTO {
  items: CustomerTO[];
  totalItems: number;
}
