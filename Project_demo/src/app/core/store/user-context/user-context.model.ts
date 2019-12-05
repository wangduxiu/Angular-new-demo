import { UserContext } from './user-context.interface';

export const initialUserContext: UserContext = {
  contextLoaded: false,
  contextLoading: false,
  customersLoaded: false,
  customersLoading: false,
  id: null,
  email: null,
  firstName: '',
  lastName: '',
  initials: '',
  language: 'en',
  isAdmin: false,
  isAgent: false,
  isEpsUser: false,
  customers: null,
  salesOrganisations: null,
  canRelocate: false,
  useEmailActors: false,
  isTransporter: false,
  adminRoles: {
    updateEpsUser: false,
    inviteEpsUser: false,
    createClientUser: false,
    updateClientUser: false,
    inviteClientUser: false,
    resetPassword: false,
    reInvite: false,
  },
  showTutorial: true
};
