import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { fadeInAnimation } from 'app/animations';
import { TranslationHelperService } from 'app/core/services/translate-helper.service';
import { ValidatorService } from 'app/core/services/validator.service';
import { FlorderDetail } from 'app/core/store/florder-detail/florder-detail.interface';
import { util } from 'app/core/util/util';

export function getRecurrenceFormGroup(florderDetail: FlorderDetail, formBuilder: FormBuilder, validatorService: ValidatorService): FormGroup {
  const control = formBuilder.group({
    active: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.active],
    pattern: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.pattern],
    endDate: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.endDate],
    weekly: formBuilder.group({
      monday: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.monday],
      tuesday: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.tuesday],
      wednesday: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.wednesday],
      thursday: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.thursday],
      friday: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.friday],
      saturday: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.saturday],
      sunday: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.sunday]
    }), monthly: formBuilder.group({
      monthlyRecurrencyType: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.monthlyRecurrencyType],
      day: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.day],
      monthPeriodicy1: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.monthPeriodicy1],
      monthPeriodicy2: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.monthPeriodicy2],
      which: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.which],
      weekday: [florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.weekday]
    })
  });

  const checkboxCheckedCountValidator = (control: AbstractControl): { [key: string]: boolean } => {
    const oneIsChecked = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map(val => val.toLowerCase()).map(val => control.get(val)).reduce((prev, cur) => prev || cur.value, false);
    if (oneIsChecked) {
      return null;
    } else {
      return {NONE_CHECKED: true};
    }
  };

  const weeklyCondition = util.createCondition(() => control.controls.pattern, 'weekly');
  const recurrenceCondition = util.createCondition(() => control.controls.active);
  util.conditionalValidation(control, () => control.controls.endDate, [recurrenceCondition], [Validators.required, validatorService.datePatternValidator]);
  util.conditionalValidation(control, () => control.controls.weekly, [weeklyCondition, recurrenceCondition], [checkboxCheckedCountValidator]);

  return control;
}

export function updateRecurrenceFormGroup(control: FormGroup, florderDetail: FlorderDetail) {
  control.patchValue({
    active: florderDetail.planning.recurrence && florderDetail.planning.recurrence.active,
    pattern: florderDetail.planning.recurrence && florderDetail.planning.recurrence.pattern,
    endDate: florderDetail.planning.recurrence && florderDetail.planning.recurrence.endDate
  });
  const weeklyControl = control.get('weekly') as FormGroup;
  weeklyControl.patchValue({
    monday: florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.monday,
    tuesday: florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.tuesday,
    wednesday: florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.wednesday,
    thursday: florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.thursday,
    friday: florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.friday,
    saturday: florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.saturday,
    sunday: florderDetail.planning.recurrence && florderDetail.planning.recurrence.weekly.sunday
  });
  const monthlyControl = control.get('monthly') as FormGroup;
  monthlyControl.patchValue({
    monthlyRecurrencyType: florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.monthlyRecurrencyType,
    day: florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.day,
    monthPeriodicy1: florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.monthPeriodicy1,
    monthPeriodicy2: florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.monthPeriodicy2,
    which: florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.which,
    weekday: florderDetail.planning.recurrence && florderDetail.planning.recurrence.monthly.weekday
  });
}


@Component({
  selector: 'app-florder-recurrence',
  templateUrl: './florder-recurrence.component.html',
  styleUrls: ['./florder-recurrence.component.less'],
  animations: [fadeInAnimation],

})
export class FlorderRecurrenceComponent  {

  @Input() form: FormGroup;
  @Input() isEdit: boolean;

  ordinalEnum: { id: string; name: string }[] = [];
  weekdayEnum: { id: string; name: string }[] = [];

  constructor(private translationHelper: TranslationHelperService, private translate: TranslateService) {
  }

  ngOnInit(): any {
    this.ordinalEnum = this.translationHelper.translateArrayInstant(['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'LAST'],
      (value, translation) => {
        return {id: value, name: translation};
      },
      'SHARED.ORDINAL.');
    this.weekdayEnum = this.translationHelper.translateArrayInstant(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
      (value, translation) => {
        return {id: value, name: translation};
      },
      'SHARED.DAYS.');
  }

  get recurrencyPattern(): string {
    if (this.form.value.pattern === 'weekly') {
      const weekly = this.form.value.weekly;
      const days = this.weekdayEnum.filter(day => weekly[day.id.toLowerCase()]).map(day => day.name).join(', ');
      return this.translate.instant(`ORDERS.DELIVERY.VALUES.RECURRENCY.WEEKLY`, {days});
    } else {
      return this.translate.instant(`ORDERS.DELIVERY.VALUES.RECURRENCY.MONTHLY-${this.form.value.monthly.monthlyRecurrencyType}`.toUpperCase(), this.form.value.monthly);
    }
  }

  get endPattern(): string {
    return this.translate.instant(`ORDERS.DELIVERY.VALUES.RECURRENCY.UNTIL`, {endDate: util.localizeDateString(this.form.value.endDate)});
  }


}
