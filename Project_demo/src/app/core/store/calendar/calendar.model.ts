import { CalendarFlorders } from './calendar.interface';

export const initialState: CalendarFlorders = {
  days: [],
  loading: false,
  loaded: false,
  deliveryDaysRequesting: false,
  deliveryDaysRequested: false,
  selectedTemplate: null,
  availableDays: null,
  UI: {
    startDate: null,
    endDate: null,
  },
};
