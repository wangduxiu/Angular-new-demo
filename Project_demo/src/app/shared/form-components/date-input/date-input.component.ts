import {ChangeDetectorRef, Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {IMyDate, IMyDateModel, IMyInputFieldChanged, MyDatePicker} from 'mydatepicker-selectweek';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from '../../../app.settings';
import {DatesRange} from '../../../core/store/flow-detail/flow-detail.interface';
import {util} from '../../../core/util/util';
import {GenericInput} from '../generic-input/generic-input.component';

interface MyDate {
  year: number;
  month: number;
  day: number;
}

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true,
    },
  ],
})
export class DateInputComponent extends GenericInput<{ date: MyDate }> implements OnInit, OnChanges {
  _enableDays: IMyDate[];
  @Input()
  set enableDays(value: string[]) {
    const vals = value && value.length && value.map(val => ('' + val).trim()).filter(val => val) || null;
    this._enableDays = vals && vals.map(util.convertDateStringToMyDate) || null;
  }

  @Input() inPastOrPresent: boolean;
  @Input() inFutureOrPresent: boolean;
  @Input() inFuture: boolean;
  @Input() editableDateField: boolean = false;
  @Input() innerText: string;
  @Input() error: string;
  @Input() selectWeek: boolean;
  @Input() datePattern: string;
  @Input() showOnTop: boolean = false;
  @Input() disableSince: MyDate;
  @Input() disableUntil: MyDate;
  @Input() validRange: { [key: string]: MyDate };
  @Input() date;

  formattedDate: string;

  _mydate: MyDatePicker;
  @ViewChild('mydate')
  set mydate(val: MyDatePicker) {
    this._mydate = val;
    this.setDatePickerOptions();
  };

  get mydate(): MyDatePicker {
    return this._mydate;
  }

  myDatePickerOptions;

  get value(): { date: MyDate } {
    return this._value;
  }

  set value(val) {
    this._value = val;
  }

  private contractDetails$: Observable<any>;

  constructor(translate: TranslateService, controlContainer: ControlContainer, private cd: ChangeDetectorRef) {
    super('date', translate, controlContainer);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.setDatePickerOptions();
    // UAT 2484: options were not yet set on mydate when onInit or before, so wait a tick and generate formattedDate => dates are formatted according to DATE_FORMAT_DATEPICKER
    setTimeout(() => this.formattedDate = this.getFormattedDate());
  }

  private setDatePickerOptions() {
    this.myDatePickerOptions = {
      openSelectorTopOfInput: this.showOnTop,
      showSelectorArrow: false,
      inline: false,
      alignSelectorRight: true,
      editableDateField: this.editableDateField !== false,
      openSelectorOnInputClick: true,
      disableHeaderButtons: false,
      showWeekNumbers: true,
      selectWeek: !!this.selectWeek,
      dateFormat: this.datePattern || (this.selectWeek ? AppSettings.WEEK_FORMAT_DATEPICKER : AppSettings.DATE_FORMAT_DATEPICKER)
    };

    if (this.mydate) {
      if (this._enableDays && this._enableDays.length) {
        Object.assign(this.myDatePickerOptions, {
          // disableSince: { year: 2000, month: 1, day: 1 },
          disableUntil: { year: 3000, month: 1, day: 1 }, enableDays: this._enableDays,
        });
      } else if (this.disableSince) {
        Object.assign(this.myDatePickerOptions, {
          disableSince: this.disableSince,
        });
      } else if (this.disableUntil) {
        Object.assign(this.myDatePickerOptions, {
          disableUntil: this.disableUntil,
        });
      } else if (this.inPastOrPresent) {
        // need to add a month --> calendar works zero based
        // need to add a day --> from tomorrow till forever we want the dates disabled only today and past selectable
        const tomorrow = moment().add(1, 'day');
        Object.assign(this.myDatePickerOptions, {
          disableSince: { year: tomorrow.year(), month: tomorrow.month() + 1, day: tomorrow.date() },
        });
      } else if (this.inFuture) {
        // need to add a month --> calendar works zero based
        // need to add a day --> from tomorrow till forever we want the dates disabled only today and past selectable
        const today = moment();
        Object.assign(this.myDatePickerOptions, {
          disableUntil: { year: today.year(), month: today.month() + 1, day: today.date() },
        });
      } else if (this.inFutureOrPresent) {
        // need to add a month --> calendar works zero based
        // need to add a day --> from tomorrow till forever we want the dates disabled only today and past selectable
        const today = moment();
        Object.assign(this.myDatePickerOptions, {
          disableUntil: { year: today.year(), month: today.month() + 1, day: today.date() - 1 },
        });
      } else if (this.validRange) {
        Object.assign(this.myDatePickerOptions, {
          disableUntil: this.validRange.startDate,
          disableSince: this.validRange.endDate,
          // need to include the borders
          enableDays: [this.validRange.startDate, this.validRange.endDate],
        });
      }
      this.mydate.setOptions();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.validRange) {
      const value: DatesRange = { ...changes.validRange.currentValue };
      this.validRange = (value
        && value.startDate
        && value.endDate) && {
          startDate: util.convertDateStringToMyDate(value.startDate),
          endDate: util.convertDateStringToMyDate(value.endDate),
        } || null;
    }

    if (changes.date && changes.date.currentValue && !changes.date.currentValue.flowDate) {
      this.value = null;
    }

    if (changes.datePattern && this.myDatePickerOptions) {
      // Trigger re-rendering the value in the datepicker (formatting UAT 2483)
      this._value = util.jsonDeepCopy(this._value);
    }
    this.setDatePickerOptions();
    this.formattedDate = this.getFormattedDate();
  }

  writeValue(value: string): void {
    if (value) {
      const day = moment(value);
      if (day.isValid()) {
        this.value = {
          date: { year: day.year(), month: day.month() + 1, day: day.date() },
        };
        this.formattedDate = this.getFormattedDate();
      } else {
        this.value = { date: null };
      }
    } else {
      this.value = { date: null };
      this._mydate.clearDate();
    }
  }

  onInputFocusBlur(event) {
    switch (event.reason) {
      case 1: // focus to input box
        this.onFocus();
        break;
      case 2: // focus out of input box
        this.onBlur();
        break;
    }
  }

  private getAdjustedWeekDate(dateStr: string): string {
    let date = util.parseDate(dateStr);
    date = moment.utc(date).subtract(1, 'days').toDate();
    return util.formatDate(date);
  }

  onDateChanged(event: IMyDateModel) {
    if (event.epoc > 0) {
      let dateValue = moment({ ...event.date, month: event.date.month - 1 }).format(AppSettings.DATE_FORMAT_MOMENT_REST);
      if (this.selectWeek) {
        dateValue = this.getAdjustedWeekDate(dateValue);
      }
      this.control.control.markAsTouched();
      this.propagateChange(dateValue);
    }
  }

  onInputFieldChanged(event: IMyInputFieldChanged) {
    if (!event.valid) {
      const val = event.value || null;
      try {
        this.propagateChange(val || '');
      } catch (e) {
        // Ignore
      }
    } else if (this.value != null) {
      let dateValue = moment({ ...this.value.date, month: this.value.date.month - 1 }).format(AppSettings.DATE_FORMAT_MOMENT_REST);
      if (this.selectWeek) {
        dateValue = this.getAdjustedWeekDate(dateValue);
      }
      this.propagateChange(dateValue);
    }
    this.cd.detectChanges();
  }

  onCalendarToggle(event: number) {
    this.control['markAsTouched'] && this.control['markAsTouched']();
  }

  getFormattedDate(): string {
    return this.mydate && this.value && this.value.date && this.mydate.formatDate(this.value.date);
  }

  getFocusableElement(): { focus: () => any } {
    return this.mydate && {
      focus: () => this.mydate.setFocusToInputBox(),
    };
  }

}
