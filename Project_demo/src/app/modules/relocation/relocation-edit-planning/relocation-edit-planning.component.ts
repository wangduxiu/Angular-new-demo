import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LoadingDates } from 'app/core/store/relocation-detail/relocation-detail.interface';
import { getRecurrenceFormGroup, updateRecurrenceFormGroup } from 'app/modules/florders/recurrence/florder-recurrence.component';
import { TranslationHelperService } from '../../../core/services/translate-helper.service';
import { ValidatorService } from '../../../core/services/validator.service';
import { AuthorizationMatrixTO } from '../../../core/store/contract-details/contract-details.interface';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { util } from '../../../core/util/util';
import { FlorderEditPlanningComponent } from '../../florders/florder-edit-planning/florder-edit-planning.component';

@Component({
  selector: 'app-relocation-edit-planning',
  templateUrl: './relocation-edit-planning.component.html',
  styleUrls: ['../../florders/florder-edit-planning/florder-edit-planning.component.less']
})
export class RelocationEditPlanningComponent extends FlorderEditPlanningComponent implements OnChanges {
  orderContainsCombinations: boolean;

  @Input() relocationDetail: FlorderDetail;
  @Input() authorization: AuthorizationMatrixTO;
  @Input() availableLoadingDates: LoadingDates;

  constructor(formBuilder: FormBuilder, validatorService: ValidatorService, private translationHelper: TranslationHelperService, private translate: TranslateService) {
    super(formBuilder, validatorService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.relocationDetail && this.relocationDetail && this.editFlorderPlanningForm) {
      this.updateForm();
    }
  }

  ngOnInit(): any {
    super.ngOnInit();
  }

  createForm() {
    const loadingDateValidators = (this.panelStatus.createTemplate || this.panelStatus.editTemplate) ? null : [Validators.required, this.validatorService.datePatternValidator];
    const unloadingDateValidators = (this.panelStatus.createTemplate || this.panelStatus.editTemplate) ? null : [Validators.required, this.validatorService.datePatternValidator];

    this.orderContainsCombinations = this.relocationDetail && this.relocationDetail.materials && !!this.relocationDetail.materials.find(m => m.type === 'combination');
    const controlsConfig = {
      orderDate: [this.relocationDetail.planning.orderDate || undefined],
      loadingDate: [this.relocationDetail.planning.loadingDate || undefined, loadingDateValidators],
      unloadingDate: [this.relocationDetail.planning.unloadingDate || undefined],
      exchangePallets: [this.relocationDetail.planning.exchangePallets],
      numberOfExchangePallets: [this.orderContainsCombinations && (this.relocationDetail.planning.numberOfExchangePallets || '')],
      createTemplate: [this.relocationDetail.createTemplate || this.panelStatus.createTemplate || this.panelStatus.editTemplate],
      templateName: [this.relocationDetail.templateName],
      recurrence: getRecurrenceFormGroup(this.relocationDetail, this.formBuilder, this.validatorService)
    };
    this.editFlorderPlanningForm = this.formBuilder.group(controlsConfig);

    util.conditionalValidation(this.editFlorderPlanningForm, 'numberOfExchangePallets', [util.createCondition('exchangePallets')], [Validators.required, Validators.min(1)]);
    util.conditionalValidation(this.editFlorderPlanningForm, 'templateName', [util.createCondition('createTemplate')], [Validators.required]);
    const unloadingDateAfterLoadingDateValidator: ValidatorFn = (dateControl: FormControl) => {
      try {
        const unloadingDate = dateControl.value;
        if (typeof unloadingDate === 'string' && unloadingDate !== '' && !this.editFlorderPlanningForm.value.recurrence.active) {
          const loadingDate = this.editFlorderPlanningForm.value.loadingDate;
          if (loadingDate && util.parseDate(loadingDate).getTime() > util.parseDate(unloadingDate).getTime()) {
            return { unloadingDateAfterLoadingDateValidator: true };
          }
        }
      } catch (e) { // Avoid crash in app
      }
      return null;
    };
    util.conditionalValidation(this.editFlorderPlanningForm, 'unloadingDate', [util.createCondition('loadingDate')], [Validators.required, this.validatorService.datePatternValidator, unloadingDateAfterLoadingDateValidator], unloadingDateValidators);

    this.formValidChanged.emit(this.editFlorderPlanningForm.valid);
    this.editFlorderPlanningForm.statusChanges.map(data => this.editFlorderPlanningForm.valid).distinctUntilChanged().subscribe(valid => {
      this.formValidChanged.emit(valid);
    });
  }

  updateForm() {
    this.orderContainsCombinations = this.relocationDetail && this.relocationDetail.materials && !!this.relocationDetail.materials.find(m => m.type === 'combination');
    this.editFlorderPlanningForm.patchValue({
      orderDate: this.relocationDetail.planning.orderDate || undefined,
      loadingDate: this.relocationDetail.planning.loadingDate || undefined,
      unloadingDate: this.relocationDetail.planning.unloadingDate || undefined,
      exchangePallets: this.relocationDetail.planning.exchangePallets,
      numberOfExchangePallets: this.relocationDetail.planning.numberOfExchangePallets || this.relocationDetail.planning.maxAmountOfPalletExchangeAvailable,
      createTemplate: this.relocationDetail.createTemplate || this.panelStatus.createTemplate || this.panelStatus.editTemplate,
      templateName: this.relocationDetail.templateName,
    });
    const recurrenceControl = this.editFlorderPlanningForm.get('recurrence') as FormGroup;
    updateRecurrenceFormGroup(recurrenceControl, this.relocationDetail);
    recurrenceControl.get('active').valueChanges.subscribe((active) => {
      if (active) {
        this.editFlorderPlanningForm.get('loadingDate').patchValue('');
      }
    })
  }
}
