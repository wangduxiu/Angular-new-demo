import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationErrors } from '@angular/forms/src/directives/validators';
import { getRecurrenceFormGroup, updateRecurrenceFormGroup } from 'app/modules/florders/recurrence/florder-recurrence.component';
import { ValidatorService } from '../../../core/services/validator.service';
import { AuthorizationMatrixTO, CDOpeningHours } from '../../../core/store/contract-details/contract-details.interface';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { util } from '../../../core/util/util';
import { FlorderEditPlanningComponent } from '../../florders/florder-edit-planning/florder-edit-planning.component';

@Component({
  selector: 'app-order-edit-planning',
  templateUrl: './order-edit-planning.component.html',
  styleUrls: ['../../florders/florder-edit-planning/florder-edit-planning.component.less']
})
export class OrderEditPlanningComponent extends FlorderEditPlanningComponent implements OnChanges {
  orderContainsCombinations: boolean;

  @Input() availablePickingDates: string[];
  @Input() orderDetail: FlorderDetail;
  @Input() openingHours: CDOpeningHours[];
  @Input() authorization: AuthorizationMatrixTO;

  constructor(formBuilder: FormBuilder, validatorService: ValidatorService) {
    super(formBuilder, validatorService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.orderDetail && this.orderDetail && this.editFlorderPlanningForm) {
      this.updateForm();
    }
  }

  createForm() {
    const dateInAvailableDatesValidator = (dateControl: FormControl) => {
      const value = dateControl.value;
      if (typeof value === 'string' && value !== '') {
        if (this.availablePickingDates.indexOf(value) < 0) {
          return {dateNotAvailable: true};
        }
      }
      return null;
    };
    this.orderContainsCombinations = this.orderDetail && this.orderDetail.materials && !!this.orderDetail.materials.find(m => m.type === 'combination');
    const loadingDateValidators = (this.panelStatus.createTemplate || this.panelStatus.editTemplate) ? null : [Validators.required, this.validatorService.datePatternValidator, dateInAvailableDatesValidator];
    const controlsConfig = {
      orderDate: [this.orderDetail.planning.orderDate || undefined],
      loadingDate: [this.orderDetail.planning.loadingDate || undefined, loadingDateValidators],
      exchangePallets: [this.orderDetail.planning.maxAmountOfPalletExchangeAvailable === 0 ? false : this.orderDetail.planning.exchangePallets],
      numberOfExchangePallets: ['' + ((this.orderContainsCombinations && (this.orderDetail.planning.numberOfExchangePallets || this.orderDetail.planning.maxAmountOfPalletExchangeAvailable)) || 0)],
      createTemplate: [this.orderDetail.createTemplate || this.panelStatus.createTemplate || this.panelStatus.editTemplate, Validators.required],
      templateName: [this.orderDetail.templateName],
      recurrence: getRecurrenceFormGroup(this.orderDetail, this.formBuilder, this.validatorService)
    };
    this.editFlorderPlanningForm = this.formBuilder.group(controlsConfig);

    const maxValidator = (c: AbstractControl): ValidationErrors | null => {
      return Validators.max(this.orderDetail.planning.maxAmountOfPalletExchangeAvailable)(c); // This way, the actual value of this field is used instead of the value when the validator is created
    };
    util.conditionalValidation(this.editFlorderPlanningForm, 'numberOfExchangePallets', [util.createCondition('exchangePallets')], [Validators.required, maxValidator, Validators.min(1)]);
    util.conditionalValidation(this.editFlorderPlanningForm, 'templateName', [util.createCondition('createTemplate')], [Validators.required]);

    this.formValidChanged.emit(this.editFlorderPlanningForm.valid);
    this.editFlorderPlanningForm.statusChanges.map(data => this.editFlorderPlanningForm.valid).distinctUntilChanged().subscribe(valid => {
      this.formValidChanged.emit(valid);
    });
  }

  updateForm() {
    this.orderContainsCombinations = this.orderDetail && this.orderDetail.materials && !!this.orderDetail.materials.find(m => m.type === 'combination');
    this.editFlorderPlanningForm.patchValue({
      orderDate: this.orderDetail.planning.orderDate || undefined,
      loadingDate: this.orderDetail.planning.loadingDate || undefined,
      exchangePallets: this.orderDetail.planning.exchangePallets,
      numberOfExchangePallets: this.orderDetail.planning.numberOfExchangePallets || this.orderDetail.planning.maxAmountOfPalletExchangeAvailable,
      createTemplate: this.orderDetail.createTemplate || this.panelStatus.createTemplate || this.panelStatus.editTemplate,
      templateName: this.orderDetail.templateName,
    });
    const recurrenceControl = this.editFlorderPlanningForm.get('recurrence') as FormGroup;
    updateRecurrenceFormGroup(recurrenceControl, this.orderDetail);
  }

  getOpeningHoursText(): string {
    const date = this.editFlorderPlanningForm && util.parseDateString(this.editFlorderPlanningForm.value.loadingDate);
    if (date && this.openingHours) {
      const selectedDate = new Date(date.year, date.month - 1, date.day);
      const openingHour = this.openingHours.find(oh => oh.weekdayNr === selectedDate.getDay());
      return openingHour && openingHour.slots.reduce((t, slot) => {
        return (t.length ? t + ' / ' : '') + `${slot.from} - ${slot.to}`;
      }, '');
    }
    return '';
  }

  doNextClicked() {
    if (this.isValidForm()) {
      this.nextClicked.emit(this.editFlorderPlanningForm.value);
    }
  }
}
