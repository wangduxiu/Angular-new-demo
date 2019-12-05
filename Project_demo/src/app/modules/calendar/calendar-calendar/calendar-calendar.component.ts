import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { IMyDateModel, MyDatePicker } from 'mydatepicker-selectweek';
import { AppSettings } from '../../../app.settings';
import { CalendarDay, CalendarWeek, DayWithFlordersInfo } from '../../../core/store/calendar/calendar.interface';
import { AvailablePickingDates } from '../../../core/store/florder-detail/florder-detail.interface';
import { Florder } from '../../../core/store/florders/florder.interface';

@Component({
  selector: 'app-calendar-calendar',
  templateUrl: './calendar-calendar.component.html',
  styleUrls: ['./calendar-calendar.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarCalendarComponent implements OnInit, OnChanges  {
  isInitialized: boolean = false;

  weeks: CalendarWeek[] = [];
  selectedDay: moment.Moment;
  month: moment.Moment;
  start: moment.Moment;

  date: string;

  @Input() days: DayWithFlordersInfo[];
  @Input() availableDays: AvailablePickingDates;

  @Output() showFlorderModal = new EventEmitter<CalendarDay>();
  @Output() loadFlorders = new EventEmitter<{fromDate: string, toDate: string}>();
  @Output() openFlorder = new EventEmitter<Florder>();
  @Output() requestDeliveryDates = new EventEmitter();

  _mydate: MyDatePicker;
  @ViewChild('mydate')
  set mydate(val: MyDatePicker) {
    this._mydate = val;
    this.setDatePickerOptions();
  }

  get mydate(): MyDatePicker {
    return this._mydate;
  }

  myDatePickerOptions;

  constructor() {
  }

  ngOnInit(): void {
    this.isInitialized = true;
    this.initValues(true);
    this.setDatePickerOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.days && (this.days.length > 0 || this.days.length === 0)) {
      if(this.isInitialized) {
        this.initValues(false);
      }
    }

    if (this.availableDays && (this.availableDays.full.length > 0 || this.availableDays.nonFull.length > 0)) {
      //fill in calendar with available days
      this.initValues(false);
    }
  }

  private initValues(loadOrders: boolean) {
    this.selectedDay = this._removeTime(this.selectedDay || moment());
    this.month = this.selectedDay.clone();

    this.start = this.selectedDay.clone();
    this.start.date(-6);
    this._removeTime(this.start.day(0));

    this._buildMonth(this.start, this.month);

    if (loadOrders) {
      //Only begin and end of current selected month
      // const fromDate = this.month.startOf('month').format(AppSettings.DATE_FORMAT_MOMENT_REST);
      // const toDate = this.month.endOf('month').format(AppSettings.DATE_FORMAT_MOMENT_REST);

      //Only begin and end of visible days on calendar
      const fromDate = this.weeks[0].days[0].date.format(AppSettings.DATE_FORMAT_MOMENT_REST);
      const toDate = this.weeks[this.weeks.length-1].days[6].date.format(AppSettings.DATE_FORMAT_MOMENT_REST);
      this.loadFlorders.emit({ fromDate, toDate });
    }
  }

  private setDatePickerOptions() {
    this.myDatePickerOptions = {
      openSelectorTopOfInput: false,
      showSelectorArrow: false,
      inline: false,
      editableDateField: false,
      openSelectorOnInputClick: true,
      dateFormat: AppSettings.DATE_FORMAT_DATEPICKER,
      disableUntil: {
        year: moment().year(),
        month: moment().month(),
        day: moment().date(0).date(),
      }
    };

    if (this.mydate) {
      this.mydate.setOptions();
    }
  }

  _removeTime(date) {
    return date.day(1).hour(0).minute(0).second(0).millisecond(0);
  }

  _buildMonth(start, month) {
    this.weeks = [];
    this._removeTime(start.endOf('month').day(0));
    let done = false, date = start.clone(), monthIndex = date.month(), count = 0;
    while (!done) {
      const week = {
        days: []
      };
      this.weeks.push(week);
      for (var i = 0; i < 7; i++) {
        const dayWithFlordersInfo = this.days.find(day => date.isSame(moment(day.unloadingDate), "day"));
        week.days.push({
          date,
          name: date.format("dd").substring(0, 1),
          number: date.date(),
          isCurrentMonth: date.month() === month.month(),
          isToday: date.isSame(new Date(), "day"),
          isWeekend: date.day() === 6 || date.day() === 0,
          isFuture: date.diff(moment()) > 0,
          dateString: date.format('YYYY-MM-DD'),
          florderInfos: dayWithFlordersInfo && dayWithFlordersInfo.florderInfos || [],
          isAvailableForDelivery: this.checkAvailableDay(date),
          totalNumberOfOrders: dayWithFlordersInfo && dayWithFlordersInfo.totalNumberOfOrders,

        } as CalendarDay);
        date = date.clone();
        date.add(1, "d");
      }
      done = count++ > 2 && monthIndex !== date.month();
      monthIndex = date.month();
    }
  }

  private checkAvailableDay(date) {
    if (this.availableDays) {
      return this.availableDays.full.indexOf(date.format("YYYY-MM-DD")) > -1;
    }
    return true;
  }

  // select(day: Day) {
  //   //prevent going to past months
  //   if ((day && day.date.year() > moment().year()) || (day && day.date.year() == moment().year() && day.date.month() >= moment().month())) {
  //     this.selectedDay = day.date;
  //     if (!day.isCurrentMonth) {
  //       this._goToMonth(day.date.month());
  //     }
  //   }
  // }

  private _goToMonth(selectedMonth: number, currentYear?: boolean) {
    this.month.month(selectedMonth);
    this.selectedDay.month(selectedMonth).endOf('month').subtract(14, 'days');

    if (currentYear) {
      this.month.year(moment().year());
      this.selectedDay.year(moment().year());
    }

    // const fromDate = this.month.startOf('month').format(AppSettings.DATE_FORMAT_MOMENT_REST);
    // const toDate = this.month.endOf('month').format(AppSettings.DATE_FORMAT_MOMENT_REST);
    // this.loadOrders.emit({ florderDateFrom: fromDate, florderDateTo: toDate });
    this.initValues(true);

    // request delivery dates
    this.requestDeliveryDates.emit();
  }

  next() {
    this._goToMonth(this.month.month() + 1);
  }

  previous() {
    //prevent going to past months
    if (this.isCurrentMonthNotInPast()) {
      this._goToMonth(this.month.month() - 1);
    }
  }

  isCurrentMonthNotInPast() {
    return this.month.year() > moment().year() || this.month.year() == moment().year() && this.month.month() > moment().month();
  }

  showToday() {
    this.date = moment().format(AppSettings.DATE_FORMAT_DATEPICKER);
    this._goToMonth(moment().month(), true);
  }

  onDateChanged(event: IMyDateModel) {
    if (event.epoc > 0) {
      const dateValue = moment({...event.date, month: event.date.month -1} ).format(AppSettings.DATE_FORMAT_MOMENT_REST);
      this._goToMonth(moment(dateValue).month());
    }
  }
}
