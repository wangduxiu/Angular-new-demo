export interface CustomersTO {
  [key: string]: {
    name: string,
    roleId: string,
    shipTos?: { [key: string]: string }
  };
}

export interface SalesOrganisationsTO {
  [key: string]: string;
}

export interface UserTO {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  alternateMail?: string;
  userType: string;
  language: string;
  customers?: CustomersTO; // not in EPS user
  salesOrganisations?: SalesOrganisationsTO; // Not in client user
  status?: string; // not in EPS user
  isAdmin: boolean;
  isAssigned: boolean;
  isActive: boolean;
  isAgent: boolean;
  canRelocate: boolean;
  useEmailActors: boolean;
  isTransporter: boolean;
  invitationStatus: string;
  updateEpsUser: boolean;
  inviteEpsUser: boolean;
  createClientUser: boolean;
  updateClientUser: boolean;
  inviteClientUser: boolean;
  resetPassword: boolean;
  reInvite: boolean;
  invitationAccepted: boolean;
}
