import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarDay, FlorderInfo } from '../../../core/store/calendar/calendar.interface';

@Component({
  selector: 'app-calendar-day',
  templateUrl: './calendar-day.component.html',
  styleUrls: ['./calendar-day.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDayComponent {

  @Input() day: CalendarDay;
  @Input() selectedDay: CalendarDay;

  @Output() showFlorderModal = new EventEmitter<CalendarDay>();
  @Output() openFlorder = new EventEmitter<FlorderInfo>();

  constructor() {
  }

  getMonthAbbreviation() {
    return this.day.date.format('MMM');
  }
}
