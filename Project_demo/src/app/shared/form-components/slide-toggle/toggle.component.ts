import { Component, forwardRef } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenericInput } from '../generic-input/generic-input.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Toggle),
      multi: true,
    },
  ],
})
export class Toggle extends GenericInput<boolean>{

  constructor(translate: TranslateService, controlContainer: ControlContainer) {
    super('toggle', translate, controlContainer);
  }

  writeValue(value: string | boolean): void {
    if (typeof value === 'string') {
      this._value = value && value.toLowerCase() === 'true';
    } else if (typeof value == 'boolean') {
      this._value = value as boolean;
    } else {
      this._value = false;
    }
  }


  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  getFocusableElement(): { focus: () => {} } {
    return null; // TODO
  }

}
