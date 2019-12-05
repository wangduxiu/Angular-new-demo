import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { util } from '../../core/util/util';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-select-email-addresses-modal',
  templateUrl: './modal-select-email-addresses.component.html',
  styleUrls: ['./modal-select-email-addresses.component.less']
})
export class SelectEmailAddressesModalComponent implements OnInit {

  selectEmailAddressesForm;

  constructor(private dialogRef: MdDialogRef<SelectEmailAddressesModalComponent>, @Inject(MD_DIALOG_DATA) public data: any, private formBuilder: FormBuilder) {
  }

  private getControlsConfig() {
    return {
      selectedEmailAddresses: []
    }
  }

  ngOnInit(): void {
    this.selectEmailAddressesForm = this.formBuilder.group(this.getControlsConfig());
  }

  close(isSubmit: boolean) {
    this.dialogRef.close({ isSubmit: isSubmit, emailAddresses: this.selectEmailAddressesForm.value.selectedEmailAddresses });
  }
}
