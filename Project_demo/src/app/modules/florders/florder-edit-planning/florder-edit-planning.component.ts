import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PanelStatus } from '../florder-edit-container/florder-edit.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorService } from '../../../core/services/validator.service';

export abstract class FlorderEditPlanningComponent implements OnInit {

  @Input() panelStatus: PanelStatus;

  @Output() nextClicked = new EventEmitter<any>();
  @Output() cancelClicked = new EventEmitter(); // Go back to orders-list
  @Output() backClicked = new EventEmitter();
  @Output() formValidChanged = new EventEmitter();

  editFlorderPlanningForm: FormGroup;

  constructor(protected formBuilder: FormBuilder, protected validatorService: ValidatorService) {}

  ngOnInit() {
    this.createForm();
  }

  abstract createForm();

  isValidForm(): boolean {
    return !this.editFlorderPlanningForm.invalid;
  }
}
