export interface UsersFilter {
  id?: string;
  type?: 'EpsUser' | 'ClientUser';
  lastName?: string;
  firstName?: string;
  email?: string;
  isAssigned?: boolean;
  isNotAssigned?: boolean;
  isActive?: boolean;
  isNotActive?: boolean;
  isAdmin?: boolean;
  isNotAdmin?: boolean;
}
