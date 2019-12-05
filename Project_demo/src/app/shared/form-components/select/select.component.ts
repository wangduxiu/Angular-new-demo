import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, forwardRef, Input, OnChanges, Optional, SimpleChanges, ViewChild} from '@angular/core';
import {ControlContainer, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MdOption} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {logger} from 'app/core/util/logger';
import {GenericInput} from '../generic-input/generic-input.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Select),
      multi: true
    }
  ]
})

/**
 * Select Form component with special features
 *
 * @Input value
 * Initial value
 *
 * Input readonly
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
 * @Input includeBlank
 * Include a blank entry (id=Select.BLANK) in the options.
 *
 * @Input allowBlank
 * Include a blank entry if needed (id=Select.BLANK) in the options.
 * Warning: when invalid value and not 'includeAll', then a blank entry will be inserted and the value will be set to Select.BLANK
 *
 * @Output change
 * When selection is changed
 *
 */ export class Select extends GenericInput<string | { id: string, name: string } | string[]> implements AfterViewInit, OnChanges {

  static BLANK = ' ';// Must be 'true' when == , so don't use '' because it's resolved to false

  private initialized: boolean = false;

  @ViewChild('select') select: ElementRef;

  @Input() valueAsObject: boolean = false;
  @Input() elements: { id: any, name: string, title?: string, valueAndTitle?: string, hidden?: boolean }[];
  @Input() private includeAll: boolean;
  @Input() private includeBlank: boolean;
  @Input() private allowBlank: boolean;
  @Input() autoHeight = false;
  @Input() hideReadonlyPadding: boolean = false;
  @Input() multiple: boolean = false;

  // private debugMode = true && !environment.production;
  private debugMode = false;

  constructor(translate: TranslateService, @Optional() controlContainer: ControlContainer, private cd: ChangeDetectorRef) {
    super('select', translate, controlContainer);
  }

  private initElements(): void {
    if (!this.elements) {
      this.elements = [];
    } else {
      this.elements = this.elements.filter(element => !element.hidden).map((e) => {
        if (typeof e === 'string') {
          return {
            id: e,
            name: e,
            valueAndTitle: e
          };
        }
        if (this.debugMode) {
          return Object.assign({}, e, {
            valueAndTitle: `[${e.id}] ${e.name} <span class='option-title' accesskey='${e.title || ''}'></span>` // tslint:disable-line quotemark
          });
        }else {
          return Object.assign({}, e, {
            valueAndTitle: `${e.name} <span class='option-title' accesskey='${e.title || ''}'></span>` // tslint:disable-line quotemark
          });
        }
      });

      if (this.elements.length === 1 && !this.includeBlank && !this.multiple) {
        this.value = this.valueAsObject ? this.elements[0] : this.elements[0].id;
        this.setTitle();
        this.change.emit();
      }

      this.includeAllIfNeeded();
      this.includeBlankIfNeeded();
    }

  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initElements();
    this.includeAllIfNeeded();
    this.includeBlankIfNeeded();
    this.initialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.includeAll && this.includeBlank) {
      throw new Error('Only includeAll or includeBlank.  Not both !!'); // they are both placed on top and then we have an issue in the code.  doesn't make sense neither
    }
    if (this.initialized) {
      if (changes.elements) {
        this.initElements();
      }
      if (this.includeAll) {
        this.includeAllIfNeeded();
      }
      if (this.allowBlank || this.includeBlank) {
        this.includeBlankIfNeeded();
      }
    }
  }

  ngAfterViewInit(): void {
    this.setTitle();
  }

  onClose() {
    this.setTitle();
  }

  getFocusableElement(): { focus: () => {} } {
    return this.select && this.select['_element'] && this.select['_element'].nativeElement;
  }

  private getValueId(): string | string[] {
    if (this.multiple) {
      return this.value as string[];
    } else {
      if (!this.value) {
        return this.valueAsObject ? null : '';
      }
      if (this.value['id']) {
        return (this.value as { id: string, name: string }).id;
      }
      return this.value as string;
    }
  }

  private setTitle() {
    setTimeout(() => {
      if (this.select) {
        const selectedElement = this.elements.find(e => e.id === this.getValueId());

        if (selectedElement && selectedElement.title) {
          const domElement = this.select['_element'].nativeElement.querySelector('.mat-select-value-text');
          domElement && domElement.setAttribute('accesskey', selectedElement.title);
        }
      }
    }, 0);
  }

  writeValue(value: string): void {
    if (value && value['id']) {
      this.valueAsObject = true;
    }
    // Only when values are different, otherwise a flickering effect is visible
    if (this.valuesAreDifferent(this._value, value)) {
      this._value = value || (this.valueAsObject ? null : '');
      // Hack to clear md-select: make it disappear
      if (!this.readonly) {
        this.readonly = true;
        setTimeout(() => {
          this.readonly = false;
          this.cd.markForCheck();
        }, 0);
      }
    }
  }

  get selectedObject() {
    return this.elements.find(e => e.id === this.getValueId());
  }

  get selected() {
    let selected = this.elements.find(e => e.id === this.getValueId());
    return selected && (this.valueAsObject ? selected : selected.id);
  }

  private includeAllIfNeeded() {
    if (!this.multiple && this.includeAll && (this.elements.length === 0 || this.elements[0].id !== 'all')) {
      this.elements.splice(0, 0, {
        id: 'all',
        name: 'All',
        valueAndTitle: 'All',
        title: ' '
      });
    }
  }

  private includeBlankIfNeeded() {
    if (this.includeBlank) {
      this.allowBlank = true;
    }
    if (this.includeBlank || this.allowBlank && this.selected == null && this.elements.length !== 1) {
      this.includeBlankOption();
    }
  }

  private includeBlankOption() {
    if (this.elements.length === 0 || this.elements[0].id !== Select.BLANK)  {
      this.elements.splice(0, 0, {
        id: Select.BLANK,
        name: ' ',
        valueAndTitle: ' ',
        title: ' '
      });
    }
  }

  valueIdChanged(option: MdOption): void {
    // this.value = option.value;
    if (this.valueAsObject) {
      this.value = this.elements.find(e => e.id === option.value);
      // this.propagateChange(value);
      // this.change.emit(value);
    } else {
      this.value = option.value
      // this.propagateChange(option.value);
      // this.change.emit(option.value);
    }
  }

  doSelectAll(event): void {
    const allIds = this.elements.map(el => el.id);
    const allSelected = (this.value as string[]).length - 1 === allIds.length;

    if (allSelected) {
      this.select['writeValue']([]);
      this.value = [];
    } else {
      this.select['writeValue'](allIds);
      this.value = allIds;
    }
  }

  private valuesAreDifferent(v1: string | { id: string; name: string } | string[], v2: string | { id: string; name: string } | string[]) {
    try {

      if (!v1 && !v2) {
        return false;
      }
      if (!v1 || !v2) {
        return true;
      }
      if (Array.isArray(v1)) {
        return true; // too difficult to check
      }
      let id1 = v1;
      if (typeof v1 !== 'string' && v1['id']) {
        id1 = v1['id'];
      }
      let id2 = v2;
      if (typeof v2 !== 'string' && v2['id']) {
        id2 = v2['id'];
      }
      return id1 != id2;
    } catch (e) {
      // Shouldn't occur, but since we're in production now, just to be on the safe side
      logger.debug('select.component.valuesAreDifferent error: ' + e);
      return true;
    }
  }
}
