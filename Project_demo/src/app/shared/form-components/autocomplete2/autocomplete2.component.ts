import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, Optional, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MdAutocompleteTrigger } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { GenericInput } from '../generic-input/generic-input.component';

interface Element {
  id: any;
  name: string;
  title?: string;
  valueAndTitle?: string;
  hidden?: boolean;
}

@Component({
  selector: 'app-autocomplete2',
  templateUrl: './autocomplete2.component.html',
  styleUrls: ['./autocomplete2.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Autocomplete2),
      multi: true,
    },
  ],
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
 * @Output change
 * When selection is changed
 *
 */
export class Autocomplete2 extends GenericInput<string | Element | string[]> implements OnDestroy, OnChanges {

  private destroyed: boolean = false;
  static BLANK = ' ';// Must be 'true' when == , so don't use '' because it's resolved to false
  private initialized: boolean = false;
  private previousValue = '';

  @ViewChild(MdAutocompleteTrigger) trigger: MdAutocompleteTrigger;
  @ViewChild('textInput') textInput: ElementRef;
  @ViewChild('inputContainer') inputContainer: any;

  @Input() valueAsObject: boolean = false;
  @Input() elements: Element[];
  @Input() error: String;
  @Input() multiple: boolean = false;
  @Input() searchOnAllProperties: boolean = false;
  @Input() autoselectIfOnlyOne = true;

  @Output() errorChange = new EventEmitter<string>();

  dataModel: Element | Element[];

  // private debugMode = true && !environment.production;
  private debugMode = false;

  config: any;

  constructor(translate: TranslateService, @Optional() controlContainer: ControlContainer, private cd: ChangeDetectorRef) {
    super('autocomplete2', translate, controlContainer);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.config = {
      displayKey: 'name', // if objects array passed which key to be displayed defaults to description
      search: true, // true/false for the search functionlity defaults to false,
      height: 'auto', // height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: ' ', // text to be displayed when no item is selected defaults to Select,
      customComparator: (a, b) => {
        return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
      }, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: 9999, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: this.translate.instant('SHARED.LABELS.MORE'), // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: this.translate.instant('SHARED.LABELS.NO_RESULTS_FOUND'), // text to be displayed when no items are found while searching
      searchPlaceholder: this.translate.instant('SHARED.LABELS.SEARCH'), // label thats displayed in search input,
      searchOnKey: !this.searchOnAllProperties && ['name','id'] || undefined, // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };

    this.initElements();
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

  onClose() {
  }

  private initElements(): void {
    if (!this.elements) {
      this.elements = [];
      // this.disabled = true; // TODO don't overwrite input
    } else {
      // this.disabled = false; // TODO don't overwrite input
      this.elements = this.elements
        .filter(element => element && !element.hidden)
        .map((e) => {
          if (typeof e === 'string') {
            return {id: e, name: e, title: e, valueAndTitle: e};
          } else {
            if (this.debugMode) {
              return {
                ...e,
                name: `[${e.id}] ${e.name}`,
              };
            } else {
              return e;
            }
          }
        });

      if (this.elements.length === 1 && !this.multiple) {
        this.setValue(this.elements[0]);
      }
    }
  }

  private setValue(value: any) {
    this.dataModel = value;
    if (this.multiple) {
      if (this.valueAsObject) {
        this.value = value;
      } else {
        this.value = (value as any[]).map(v => v.id);
      }
    } else {
      if (this.valueAsObject) {
        this.value = value;
      } else {
        this.value = value && value.id || '';
      }
    }
  }

  getFocusableElement(): { focus: () => {} } {
    return this.textInput && this.textInput.nativeElement;
  }

  writeValue(value: string): void {
    if (value && value['id']) {
      this.valueAsObject = true;
    }
    this._value = value || (this.valueAsObject ? null : '');
    setTimeout(() => { // Wait a tick so that the availableItems is set first
      this.dataModel = this.selectedObject;
      this.cd.markForCheck();
    });
  }

  get selected() {
    const valueIds = this.getValueIds();
    const selected = this.elements.filter(e => valueIds.indexOf(e.id) >= 0);
    if (this.multiple) {
      return this.valueAsObject ? selected : selected.map(s => s['id']);
    } else {
      return selected.length && (this.valueAsObject ? selected[0] : selected[0].id);
    }
  }

  get selectedObject() {
    const valueIds = this.getValueIds();
    const selected = this.elements.filter(e => valueIds.indexOf(e.id) >= 0);
    if (this.multiple) {
      return selected;
    } else {
      return selected.length && selected[0] || null;
    }
  }

  private getValueIds(): string[] {
    if (!this.value) {
      return [];
    }
    if (this.multiple) {
      return (this.value as any[]).map(v => v['id'] || v);
    }
    return [this.value['id'] || this.value];
  }
}
