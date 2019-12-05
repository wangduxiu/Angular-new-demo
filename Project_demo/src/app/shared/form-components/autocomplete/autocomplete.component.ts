import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, Optional, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdAutocompleteTrigger } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Definition } from '../../../core/store/definitions/definition.interface';
import { GenericInput } from '../generic-input/generic-input.component';
import { Select } from '../select/select.component';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Autocomplete),
      multi: true
    }
  ]
})

/**
 * Autocomplete Form component with special features
 *
 * @Input value
 * Initial value
 *
 * @Input readonly
 * Show readonly text, not a select form component
 *
 * @Input formControlName
 * Name of control in formGroup
 *
 * @Input disabled
 * disable select component if not in readonly
 *
 * @Input elements
 * List of elements to use as options.
 * If 0 elements => disable component
 * If 1 element => default select that 1 element
 * If >1 element => Make a list of all possible elements
 *   if current value is not present in list of elements => select 'all' if 'includeAll', otherwise, add a blank and select blank
 *
 * @Input includeAll
 * Include an 'all' element in the options
 *
 * @Input allowBlank
 * Include a blank entry (id=Select.BLANK) in the options.
 * Warning: when invalid value and not 'includeAll', then a blank entry will be inserted and the value will be set to Select.BLANK
 *
 * @Output change
 * When selection is changed
 *
 */
export class Autocomplete extends GenericInput<string | { id: string, name: string } | string[]> implements OnDestroy, OnChanges {

  private destroyed: boolean = false;
  static BLANK = ' ';// Must be 'true' when == , so don't use '' because it's resolved to false
  private initialized: boolean = false;
  private previousValue = '';

  @ViewChild(MdAutocompleteTrigger) trigger: MdAutocompleteTrigger;
  @ViewChild('textInput') textInput: ElementRef;
  @ViewChild('inputContainer') inputContainer: any;

  @Input() valueAsObject: boolean = false;
  @Input() elements: { id: any, name: string, title?: string, valueAndTitle?: string, hidden?: boolean }[];
  @Input() error: String;

  @Output() errorChange = new EventEmitter<string>();

  private _includeAll: boolean;
  @Input()
  set includeAll(b: boolean) {
    this._includeAll = b;
  }

  get includeAll(): boolean {
    return this._includeAll;
  }

  private _allowBlank: boolean;
  @Input()
  set allowBlank(b: boolean) {
    this._allowBlank = b;
  }

  get allowBlank(): boolean {
    return this._allowBlank;
  }

  constructor(translate: TranslateService, @Optional() controlContainer: ControlContainer, private cd: ChangeDetectorRef) {
    super('autocomplete', translate, controlContainer);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initElements();
    this.filteredElements = this.myControl.valueChanges
      .startWith(null)
      .takeWhile(() => !this.destroyed)
      .filter(() => this.inputIsFocused)
      .map(element => element && element.name || element)
      .map(name => name ? this.filter(name) : [...this.elements]);

    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.initialized) {
      if (changes.elements) {
        this.initElements();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  ngAfterViewInit(): void {
    this.setTitle();
  }

  onClose() {
    this.setTitle();
  }

  private initElements(): void {
    if (this.includeAll) {
      this.elements = [
        {
          id: 'all',
          name: 'All',
          valueAndTitle: '',
        },
        ...(this.elements || [])
      ];
    }
    if (!this.elements) {
      this.elements = [];
      this.disabled = true;
    } else {
      this.disabled = false;
      this.elements = this.elements.filter(element => !element.hidden).map((e) => {
        if (typeof e === 'string') {
          return { id: e, name: e, valueAndTitle: e };
        }
        return Object.assign({}, e, {
          valueAndTitle: `${e.name} <span class='option-title' accesskey='${e.title || ''}'></span>`, // tslint:disable-line quotemark
        });
      });

      if (this.elements.length && this.elements[0].id === '') {
        this._value = this.valueAsObject ? this.elements[0] : this.elements[0].id;
        this.myControl.setValue(this.elements[0]);
        this.setTitle();
        this.change.emit();
      }

      if (this.elements.length === 1) {
        this.myControl.setValue(this.elements[0]);
        this.value = (this.valueAsObject ? this.elements[0] : this.elements[0].id);
        this.setTitle();
        this.change.emit();
      }
    }
    this.writeValue(this.getValueId());
  }

  getFocusableElement(): { focus: () => {} } {
    return this.textInput && this.textInput.nativeElement;
  }

  writeValue(value: string): void {
    if (value && value['id']) {
      this.valueAsObject = true;
    }
    if (value === 'all') {
      this._value = 'all';
    } else {
      this._value = value || (this.valueAsObject ? null : '');
    }
    this.myControl.setValue(this.selectedObject);
  }

  get selected() {
    const selected = this.elements.find(e => e.id === this.getValueId());
    return selected && (this.valueAsObject ? selected : selected.id);
  }

  get selectedObject() {
    const selected = this.elements.find(e => e.id === this.getValueId());
    return selected;
  }

  private includeBlank() {
    if (this.elements.length === 0 || this.elements[this.elements.length - 1].id !== Select.BLANK) {
      this.elements.push({ id: Select.BLANK, name: ' ' });
    }
  }

  private getValueId(): string {
    if (!this.value) {
      return this.valueAsObject ? null : '';
    }
    if (this.value['id']) {
      return this.value['id'];
    }
    return this.value as string;
  }

  private setTitle() {
    setTimeout(() => {
      if (this.textInput) {
        const selectedElement = this.elements.find(e => e.id === this.getValueId());

        if (selectedElement && selectedElement.title) {
          const domElement = this.inputContainer._elementRef.nativeElement.querySelector('.mat-input-wrapper');
          domElement && domElement.setAttribute('accesskey', selectedElement.title);
        } else {
          const domElement = this.inputContainer._elementRef.nativeElement.querySelector('.mat-input-wrapper');
          domElement && domElement.setAttribute('accesskey', '');
        }
      }
    }, 0);
  }

  // AUTOCOMPLETE

  myControl = new FormControl();
  inputIsFocused: boolean = false;

  filteredElements: Observable<Definition[]>;

  filter(value: string): Definition[] {
    return this.elements.filter(element => (element.name.toLowerCase().includes(value.toLowerCase())
      || element.id.toLowerCase().includes(value.toLowerCase())));
  }

  displayFn(element: Definition): string {
    return element ? element.name : '';
  }

  elementSelected(element) {
    this.value = this.valueAsObject ? element : element.id;
    this.myControl.setValue(this.value);
    this.setTitle();
    this.errorChange.emit('');
  }

  inputClicked() {
    this.textInput.nativeElement.select();
    this.inputIsFocused = true;
  }

  inputFocussed() {
    this.inputIsFocused = true;
    const value = this.myControl.value;
    this.myControl.setValue(value);
  }

  inputBlurred() {
    this.inputIsFocused = false;

    const selectedId = this.getValueId();
    const selectedElement = this.elements.find(e => e.id === selectedId);

    this.errorChange.emit('');

    if (this.myControl.value === '') {
      this.myControl.setValue(null);
      this.value = '';
      this.setTitle();
      this.errorChange.emit('No matching element found.');
    } else if (this.myControl.value && !this.myControl.value.id && !selectedId) {
      // this.myControl.setValue('');
      this.errorChange.emit('No matching element found.');
    } else if (this.myControl.value && !this.myControl.value.id) {
      this.errorChange.emit('No matching element found.');
      // this.myControl.setValue(selectedElement);
    } else {
      this.myControl.setValue(selectedElement);
    }
  }
}
