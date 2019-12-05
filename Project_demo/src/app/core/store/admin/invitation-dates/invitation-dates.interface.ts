export interface InvitationDate {
  loaded: boolean;
  loading: boolean;
  saved: boolean;
  saving: boolean;
  date: String;
}
export interface InvitationDates {
  epsUserInvitationDate: InvitationDate;
  clientUserInvitationDate: InvitationDate;
}
