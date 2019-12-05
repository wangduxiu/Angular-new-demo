import { EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersFilter } from '../../../../core/store/admin/users/users-filter.interface';

export abstract class UserFilterComponent implements OnInit {
  userFilterForm: FormGroup;

  @Output()
  filterUsers = new EventEmitter<{ value: UsersFilter; valid: boolean }>();

  constructor(protected formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.userFilterForm = this.formBuilder.group(this.getControlsConfig());
  }

  protected getControlsConfig() {
    return {
      lastName: [''],
      firstName: [''],
      email: [''],
      isAssigned: [true],
      isNotAssigned: [true],
      isActive: [true],
      isNotActive: [true],
    }
  }
}
