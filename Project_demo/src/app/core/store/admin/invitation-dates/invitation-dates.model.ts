import { InvitationDates } from './invitation-dates.interface';

export const initialState: InvitationDates = {
  epsUserInvitationDate: {
    loading: false,
    loaded: false,
    saving: false,
    saved: false,
    date: null
  },
  clientUserInvitationDate: {
    loading: false,
    loaded: false,
    saving: false,
    saved: false,
    date: null
  }
};
