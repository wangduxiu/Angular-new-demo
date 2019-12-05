import { AfterViewInit, Component, ElementRef, forwardRef, Injector, Input, ViewChild } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { GenericInput } from '../generic-input/generic-input.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInput),
      multi: true,
    },
  ],
})
export class TextInput extends GenericInput<string> implements AfterViewInit {

  @ViewChild('inputField') inputField:ElementRef;

  @Input() width: string;
  @Input() placeholder: string;
  @Input() stickyPlaceholder: string;
  @Input() disabled: boolean = false;

  private regExp: RegExp;

  @Input()
  set pattern(value: string) {
    this.regExp = new RegExp(value);
  }

  set value(val) {
    if (!this.regExp || this.regExp.test(val)) {
      this._value = val;
      this.propagateChange(val); // transmit new value to listener aka the reactive form
    } else {
      this.inputField.nativeElement.value = this._value;
    }
  }

  constructor(translate: TranslateService, controlContainer: ControlContainer, injector: Injector) {
    super('text', translate, undefined, injector);
  }

  ngAfterViewInit() {
    window.setTimeout(() => this.inputField && (this.inputField.nativeElement.value = this._value), 0);
  }

  getFocusableElement(): { focus: () => {} } {
    return this.inputField && this.inputField.nativeElement;
  }

  writeValue(value: string): void { // Get the initial value for this input component
    this._value = value || '';
    this.inputField && (this.inputField.nativeElement.value = this._value);
  }
}
