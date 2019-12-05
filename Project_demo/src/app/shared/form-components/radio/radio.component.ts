import { Component, EventEmitter, forwardRef, Host, Inject, Input, Output, ViewChild } from '@angular/core';
import { RadioGroup } from './radio-group.component';
import { MdRadioButton } from '@angular/material';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.less'],
})
export class Radio {

  @ViewChild(MdRadioButton)
  private radioButton: MdRadioButton;

  @Input() value: string;
  @Input() translationCode?: string;
  @Input() label?: string;
  @Input() readonly: boolean; // Can't be edited, do not show validation
  @Input() view: boolean; // Can't be edited, show validation error
  @Input() disabled: boolean;

  @Output() onSelect = new EventEmitter<{ event: Event }>();

  constructor(@Host() @Inject(forwardRef(() => RadioGroup)) private radioGroup: RadioGroup) {
  }

  check(event: MouseEvent) {
    this.radioGroup.value = this.value;
    this.onSelect.emit({ event });
  }

  isChecked(): boolean {
    return this.radioGroup && (this.radioGroup.value === this.value);
  }

  getSelectedLabel(): string {
    if (this.isChecked()) {
      return this.label;
    }
    return null;

  }
  getSelectedTranslationCode(): string {
    if (this.isChecked()) {
      return this.translationCode;
    }
    return null;

  }
}
