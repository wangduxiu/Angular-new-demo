export interface CalendarFilter {
  depot: string;
  orderTypeDelivery: boolean;
  orderTypeReturn: boolean;
  orderTypeDirect: boolean;
  transportEps: boolean;
  transportPickup: boolean;
  florderDateFrom: string;
  florderDateTo: string;
}
