import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { AppSettings } from '../../app.settings';

@Injectable()
export class ValidatorService {

  constructor() { }

  dateAfter(compareWithProperty: string) {
    return this.dateCompareValidator(compareWithProperty, 'dateSameOrAfter', (date: moment.Moment, otherDate: moment.Moment) => {
      return date.isAfter(otherDate);
    });
  }

  dateSameOrAfter(compareWithProperty: string) {
    return this.dateCompareValidator(compareWithProperty, 'dateSameOrAfter', (date: moment.Moment, otherDate: moment.Moment) => {
      return date.isSameOrAfter(otherDate);
    });
  }

  dateSameOrBefore(compareWithProperty: string) {
    return this.dateCompareValidator(compareWithProperty, 'dateSameOrBefore', (date: moment.Moment, otherDate: moment.Moment) => {
      return date.isSameOrBefore(otherDate);
    });
  }

  dateCompareValidator(compareWithProperty: string, errorType: string, comparator: (a: moment.Moment, b: moment.Moment) => boolean) {
    return (formControl: FormControl) => {
      try {
        const otherDateControl = formControl.parent.get(compareWithProperty);
        const otherDate = moment(otherDateControl.value);
        const date = moment(formControl.value);
        if (!date.isValid() || !otherDate.isValid() || comparator(date, otherDate)) {
          return null; // If dates not valid, this validator does not make sense
        } else {
          return { [errorType]: { date: date.format(AppSettings.DATE_FORMAT_MOMENT), otherDate: otherDate.format(AppSettings.DATE_FORMAT_MOMENT) } };
        }
      } catch (e) {
        // No valid dates or valid state.  Just ignore
      }
      return null;
    };
  }

  datePatternValidator(dateControl: FormControl) {
    const value = dateControl.value;
    if (typeof value === 'string' && value !== '') {
      const datePattern : RegExp = new RegExp('^\\d{4}-\\d{2}-\\d{2}$');
      const isValid : boolean = datePattern.test(value);
      return isValid ? null : { datePatternValidator: true };
    }
    return null;
  }

  conditionalRequiredValidator(otherField, expectedValue: any) {
    return (formControl) => {
      if (formControl.parent) {
        const value = formControl.parent.get(otherField).value;
        if (value === expectedValue && !formControl.value) {
          return { required: true };
        }
      }
      return null;
    };
  }

}
