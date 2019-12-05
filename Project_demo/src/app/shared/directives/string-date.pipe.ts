import { Pipe, PipeTransform } from '@angular/core';
import {util} from "../../core/util/util";
import * as moment from "moment";
import {AppSettings} from "../../app.settings";

@Pipe({ name: 'stringdate' })
export class StringDatePipe implements PipeTransform {
  constructor() {}

  transform(dateAsString) {
    try {
      const date = dateAsString && util.parseDateString(dateAsString);
      date.month = date.month - 1;
      return date && moment(date).format(AppSettings.DATE_FORMAT_MOMENT) || dateAsString;
    } catch (e) {
      return dateAsString;
    }
  }
}
