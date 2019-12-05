import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    },
  ],
})
export class Checkbox implements ControlValueAccessor, OnInit, OnChanges {

  propagateChange = (_: any) => {};
  hasFocused: boolean = false;

  @ViewChild('checkbox') checkbox:any;

  @Input('value') _value: boolean;// tslint:disable-line variable-name
  @Input() readonly: boolean;
  @Input() view: boolean;
  @Input() translationCode?: string;
  @Input() label?: string;
  @Input() focus: boolean = false;

  @Output() change = new EventEmitter();

  get value(): boolean {
    return this._value;
  }

  set value(val: boolean) {
    this._value = val;
    this.propagateChange(val);
  }

  ngOnInit(): void {
  }

  constructor() {
  }

  writeValue(value: any): void {
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

  registerOnTouched(): void {
  }

  ngOnChanges(inputs) {
    this.propagateChange(this.value);
  }

  ngAfterViewChecked(): void {
    this.giveFocus();
  }

  private giveFocus() {
    if (this.focus && !this.hasFocused && this.checkbox) {
      this.checkbox.focus();
      this.hasFocused = true;
    }
  }


}
