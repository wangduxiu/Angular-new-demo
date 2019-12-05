/*
INITIAL VALUES
 */

import { ClientUser, ClientUsers, EditUser, EpsUser, EpsUsers, SyncWithAD } from './users.interface';

export const initialClientUser: ClientUser = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  customers: [],
  isActive: true,
  isAssigned: false,
  userType: 'ClientUser',
  isDelayed: false,
  useEmailActors: false,
  isTransporter: false,
};

export const initialEpsUser: EpsUser = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  salesOrganisations: [],
  isAdmin: false,
  isActive: true,
  isAssigned: false,
  isAgent: false,
  canRelocate: false,
  userType: 'EpsUser',
  isDelayed: false,
  updateEpsUser: false,
  inviteEpsUser: false,
  createClientUser: false,
  updateClientUser: false,
  inviteClientUser: false,
  resetPassword: false,
  reInvite: false,
};

export const initialEditUser: EditUser = {
  user: null,
  isInvitation: false,
  isCreate: false,
  loading: false,
  loadSuccess: false,
  saving: false,
  saveSuccess: false,
  reInviting: false,
  reInviteSuccess: false,
  resettingPassword: false,
  resetPasswordSuccess: false,
  soldTosOfSalesOrganisation: [],
  shipTosOfSoldTo: []
};

export const initialClientUsers: ClientUsers = {
  items: [],
  loading: false,
  loaded: false,
  totalItems: 0,
  pageNr: 1,
  pageSize: 10,
  sortField: '',
  sortAscending: true,
  bulk: {
    finished: false,
    inProgress: false,
  }
};

export const initialEpsUsers: EpsUsers = {
  items: [],
  loading: false,
  loaded: false,
  totalItems: 0,
  pageNr: 1,
  pageSize: 10,
  sortField: '',
  sortAscending: true,
};

export const initialSyncWithAD: SyncWithAD = {
  syncing: false,
  success: false,
  error: null,
  timestamp: null,
}
