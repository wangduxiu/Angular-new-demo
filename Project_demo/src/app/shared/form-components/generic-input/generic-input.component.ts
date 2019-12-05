import { AfterViewChecked, EventEmitter, Injector, Input, Optional, Output } from '@angular/core';
import { ControlContainer, ControlValueAccessor, NgControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export abstract class GenericInput<T> implements ControlValueAccessor, AfterViewChecked {

  protected control: NgControl;

  @Input('value') protected _value: T;// tslint:disable-line variable-name
  @Input() readonly: boolean; // Can't be edited, do not show validation
  @Input() view: boolean; // Can't be edited, show validation error
  @Input() formControlName: string;
  @Input() disabled: boolean;
  @Input() focus: boolean = false;

  @Output() change = new EventEmitter();

  focused: boolean = false;
  hasFocused: boolean = false;

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  constructor(private type: string, protected translate: TranslateService, @Optional() private controlContainer?: ControlContainer, private injector?: Injector) {
  }

  ngOnInit(): void {
    if (!this.control && this.injector) {
      this.control = this.injector.get(NgControl);
    }
  }

  ngAfterViewChecked(): void {
    !this.control && this.findControl();
    this.giveFocus();
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.propagateChange(val); // transmit new value to listener aka the reactive form
    this.change.emit(val);
  }

  onBlur(): void {
    this.focused = false;
    this.propagateTouched(); // transfer touched to listener aka the reactive form
  }

  onFocus(): void {
    this.focused = true;
  }

  private giveFocus() {
    const elmnt = this.getFocusableElement();
    if (this.focus && !this.hasFocused && elmnt) {
      elmnt.focus();
      this.hasFocused = true;
    }
  }

  abstract getFocusableElement(): {focus: ()=>any};

  abstract writeValue(value: string): void;

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  translateError(key:string , value: any): string {
    const translation = this.translate.instant(key, value);
    return translation !== key ? translation : '';
  }

  get errorMessage() {
    if (this.control && this.control.touched && this.control.enabled && this.control.dirty) {
      return this.control.errors
        && Object.keys(this.control.errors)
                 .filter((key, i) => i === 0)
                 .map(key => {
                   return this.translateError(`validation-error.${this.formControlName}.${this.type}.${key}`, this.control.errors[key])
                     || this.translateError(`validation-error.${this.type}.${key}`, this.control.errors[key])
                   || key;
                 })
                 .find((m,i) => i === 0); // Get rid of array.  Just return the first one
    }
    return null;
  }

  get readOnlyErrorMessage() {
    if (this.control) {
      return this.control.errors
        && Object.keys(this.control.errors)
                 .filter((key, i) => i === 0)
                 .map(key => {
                   return this.translateError(`validation-error.${this.formControlName}.${this.type}.${key}`, this.control.errors[key])
                     || this.translateError(`validation-error.${this.type}.${key}`, this.control.errors[key]);
                 })
                 .find((m,i) => i === 0); // Get rid of array.  Just return the first one
    }
    return null;
  }

  /**
   * Find the control component of this form component used in the parent form.
   *
   * Can be replaced with:
   *   constructor(private injector: Injector) {}
   *
   *   ngOnInit() {
   *     if (!this.control) {
   *       this.control = this.injector.get(NgControl);
   *     }
   *   }
   */
  private findControl() {
    const directives = this.controlContainer && (this.controlContainer['directives'] || (this.controlContainer.formDirective && this.controlContainer.formDirective['directives']));
    let controls = directives && directives.filter(fcn => fcn.name === this.formControlName) || [];
    if (controls.length > 1) {
      const parent = this.controlContainer['_parent'] && this.controlContainer['_parent'].name;
      controls = parent && controls.filter(fcn => fcn['_parent'] && fcn['_parent'].name === parent) || controls;
    }
    switch (controls.length) {
      case 0:
        if (!this.readonly) throw `formControl with name ${this.formControlName} not found`;
        break;
      case 1:
        this.control = controls.length === 1 && controls[0];
        break;
      default:
        if (!this.readonly) throw `FormControlName ${this.formControlName} is not unique in form & parent`;
        break;
    }
  }
}
