import { AvailablePickingDates, FlorderDetail } from '../florder-detail/florder-detail.interface';
import { Moment } from 'moment';


export interface FlorderInfo {
  etmOrderNumber: string;
  salesOrderNumber: string;
  isOrder: boolean;
  isRelocation: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarDay {
  name: string;
  number: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isFuture: boolean;
  date: Moment;
  dateString: string;
  florderInfos: FlorderInfo[];
  isAvailableForDelivery: boolean;
  totalNumberOfOrders: number;
}

export interface CalendarFlorders {
  days: DayWithFlordersInfo[];
  loading: boolean;
  loaded: boolean;
  deliveryDaysRequesting: boolean;
  deliveryDaysRequested: boolean;
  selectedTemplate: FlorderDetail;
  availableDays: AvailablePickingDates;
  UI: {
    startDate: string;
    endDate: string;
  };
}

export interface DayWithFlordersInfo {
  unloadingDate: string;
  totalNumberOfOrders: number;
  florderInfos: FlorderInfo[];
}


export interface DayWithFlordersInfoTO {
  unloadingDate: string;
  totalNumberOfOrders: number;
  orders: {
    etmOrderNumber: string;
    salesOrderNumber: string[];
  }[];
}
