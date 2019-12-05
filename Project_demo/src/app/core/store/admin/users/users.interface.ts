import { AdminDefinition } from '../admin-definitions/admin-definitions.interface';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  alternateEmail?: string;
  language?: string;
  status?: string;
  isActive: boolean;
  isAssigned: boolean;
  userType: string;
  isDelayed: boolean;
  invitationAccepted?: boolean;
}

export interface EditUser {
  user: User;
  soldTosOfSalesOrganisation: AdminDefinition[]; // For client user
  shipTosOfSoldTo: AdminDefinition[]; // For client user
  isInvitation: boolean;
  isCreate: boolean;
  loading: boolean;
  loadSuccess: boolean;
  saving: boolean;
  saveSuccess: boolean;
  reInviting: boolean;
  reInviteSuccess: boolean;
  resettingPassword: boolean;
  resetPasswordSuccess: boolean;
}

export interface CustomerRole {
  soldTo: { id: string, name?: string },
  shipTos: { id: string, name?: string }[],
  shipToNames?: string;
  role: { id: string, name?: string }
}

export interface CustomerRoleEdit extends CustomerRole {
  isEdit: boolean;
}

export interface ClientUser extends User {
  customers: CustomerRole[];
  useEmailActors: boolean;
  isTransporter: boolean;
}

export interface EpsUser extends User {
  salesOrganisations: { id: string, name: string }[],// {[key as ID]: [name as name translated]}
  isAdmin: boolean;
  isAgent: boolean;
  canRelocate: boolean;
  updateEpsUser: boolean;
  inviteEpsUser: boolean;
  createClientUser: boolean;
  updateClientUser: boolean;
  inviteClientUser: boolean;
  resetPassword: boolean;
  reInvite: boolean;
}

export interface Users<U extends User> {
  items: U[];
  loading: boolean;
  loaded: boolean;
  totalItems: number;
  pageNr: number;
  pageSize: number;
  sortField: string;
  sortAscending: boolean;
  snapshotTimestamp?: string;
}

export interface Bulk {
  inProgress: boolean;
  finished: boolean;
}

export interface ClientUsers extends Users<ClientUser> {
  bulk: Bulk;
}

export interface EpsUsers extends Users<EpsUser> {
}

export interface SyncWithAD {
  syncing: boolean;
  success: boolean;
  error: string;
  timestamp?: string;
}

export interface PasswordResetResponse {
  newPassword: string;
  success: boolean;
  id: string;
}

