import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from '../../../core/services/validator.service';
import { Definition } from '../../../core/store/definitions/definition.interface';

@Component({
  selector: 'app-blank-receipt-form',
  templateUrl: './blank-receipt-form.component.html',
  styleUrls: ['./blank-receipt-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
})
export class BlankReceiptFormComponent implements OnInit {

  blankReceiptForm: FormGroup;

  @Input() receiptTypes: Definition[];

  @Input() isSaving: boolean;

  @Output() createBlankReceipts = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private validatorService: ValidatorService, private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    const controlsConfig = this.getControlsConfig();
    this.blankReceiptForm = this.formBuilder.group(controlsConfig);
    this.blankReceiptForm.get('type').setValue(this.receiptTypes[0].id);
  }

  private getControlsConfig() {
    return {
      type: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    };
  }

  createReceipts() {
    if (!this.blankReceiptForm.invalid && !this.isSaving) {
      this.createBlankReceipts.emit(this.blankReceiptForm);

      //clear the form
      this.createForm();
    }
  }
}
