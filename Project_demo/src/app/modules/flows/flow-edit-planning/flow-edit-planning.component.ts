import { Component, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { ValidatorService } from '../../../core/services/validator.service';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { CheckFlowDateResponse, DatesRange } from '../../../core/store/flow-detail/flow-detail.interface';
import { FlorderEditPlanningComponent } from '../../florders/florder-edit-planning/florder-edit-planning.component';
import { FlowDateAsyncValidator } from './flow-date-async-validator';

@Component({
  selector: 'app-flow-edit-planning',
  templateUrl: './flow-edit-planning.component.html',
  styleUrls: ['../../florders/florder-edit-planning/florder-edit-planning.component.less'],
})
export class FlowEditPlanningComponent extends FlorderEditPlanningComponent implements OnChanges {

  @Input() datesRange: DatesRange;
  @Input() flowDate: CheckFlowDateResponse;
  @Input() flowDetail: FlorderDetail;
  @Input() frequency: 'T' | 'W' | 'D';
  @Input() triggerValidation: EventEmitter<boolean>;
  private triggerValidationSubscription: any;

  datePattern = '';

  constructor(
    formBuilder: FormBuilder,
    validatorService: ValidatorService,
    private flowDateAsyncValidator: FlowDateAsyncValidator,
    private translate: TranslateService
    ) {
    super(formBuilder, validatorService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.triggerValidation) {
      if (this.triggerValidationSubscription) {
        this.triggerValidationSubscription.unsubscribe();
      }
      this.triggerValidationSubscription = this.triggerValidation.subscribe(() => {
        const flowDateControl = this.editFlorderPlanningForm.get('flowDate');
        const flowDate = flowDateControl.value;
        this.editFlorderPlanningForm.updateValueAndValidity();

        if (flowDate) {
          this.setDatePattern();
          flowDateControl.setValue(flowDate);
        }

      });
    }

    if (changes.flowDetail && this.editFlorderPlanningForm) {
      this.editFlorderPlanningForm.updateValueAndValidity();
      if (this.flowDetail.flowDateError) {
        this.editFlorderPlanningForm.setErrors({
          invalid: this.flowDetail.flowDateError,
        });
      } else {
        this.editFlorderPlanningForm.setErrors(null);
      }
    }
    this.setDatePattern();
  }

  createForm() {
    const controlsConfig = {
      flowDate: [
        this.flowDetail.planning.flowDate,
        null,
        (this.panelStatus.isEdit || this.panelStatus.isEditable) ?
        [
          this.validateDate.bind(this),
          this.flowDateAsyncValidator.validateFlowDate({
            frequency: this.frequency,
            fromId: this.flowDetail.deliveryMethod.from.id,
            toId: this.flowDetail.deliveryMethod.to.id ,
          }),
        ] : null],
    };
    this.editFlorderPlanningForm = this.formBuilder.group(controlsConfig);
    this.formValidChanged.emit(this.editFlorderPlanningForm.valid);
    this.editFlorderPlanningForm
      .statusChanges
      .map(data => this.editFlorderPlanningForm.valid)
      .distinctUntilChanged()
      .subscribe(valid => {
        this.formValidChanged.emit(valid);
        this.setDatePattern();
      });
  }

  setDatePattern () {
    if (this.frequency === 'W' || (this.flowDate && this.flowDate.frequency === 'W')) {
      this.datePattern = this.translate.instant('SHARED.DATE_FORMATS.WEEK');
    } else {
      this.datePattern = this.translate.instant('SHARED.DATE_FORMATS.DAY');
    }
  }

  validateDate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return Observable
      .from([!this.flowDetail.flowDateError || this.flowDetail.flowDateError !== null])
      .map(valid => valid ? null : { 'Invalid date': 'ERROR...' })
      .delay(1000);
  }

}
