import { Component, forwardRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { GenericInput } from '../generic-input/generic-input.component';
import { TranslateService } from '@ngx-translate/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdRadioGroup } from '@angular/material';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.less'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroup),
      multi: true,
    },
  ],
})
export class RadioGroup extends GenericInput<string>{

  @ViewChild(MdRadioGroup)
  mdRadioGroup: MdRadioGroup;


  @Input()
  translationCode: string;


  constructor(translate: TranslateService, controlContainer: ControlContainer) {
    super('radiogroup', translate, controlContainer);
  }

  writeValue(value: string): void { // Get the initial value for this input component
    this._value = value || '';
  }

  getFocusableElement(): { focus: () => {} } {
    return null; // TODO
  }

}
