export interface EmailActors {
  items: EmailActorsItem[];
  loading: boolean;
  loaded: boolean;
  saving: boolean;
  saved: boolean;
}

export interface EmailActorsItem {
  id?: number,
  customerId?: string,
  name: string;
  email: string;
  isActive?: boolean;
}

export interface SimplifiedEmailActor {
  name: string;
  email: string;
}
