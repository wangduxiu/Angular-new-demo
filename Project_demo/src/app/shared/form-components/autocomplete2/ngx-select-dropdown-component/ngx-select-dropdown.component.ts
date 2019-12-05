import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { filterBy, limitTo } from 'app/shared/form-components/autocomplete2/ngx-select-dropdown-component/utils';

@Component({
  selector: 'ngx-select-dropdown-custom',
  templateUrl: './ngx-select-dropdown.component.html',
  styleUrls: ['./ngx-select-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDropDownComponent),
      multi: true,
    },
  ],
})
export class SelectDropDownComponent implements OnInit, OnChanges, AfterViewInit {

  @ViewChildren('searchTextInput') public searchTextInput: QueryList<ElementRef>;

  /** value of the dropdown */
    // tslint:disable-next-line:variable-name
  @Input() public _value: any;

  /**
   * Get the required inputs
   */
  @Input() public options: any = [];

  /**
   * configuration options
   */
  @Input() public config: any = {};

  /**
   * Whether multiple selection or single selection allowed
   */
  @Input() public multiple: boolean = false;

  /**
   * Whether multiple selection or single selection allowed
   */
  @Input() public multipleMoreLimit: number = 999;

  /**
   * Whether multiple selection or single selection allowed
   */
  @Input() public multipleDelimiter = ' | ';

  /**
   * Value
   */
  @Input() public disabled: boolean;

  /**
   * automatic disabled when only 1 element && autoselectIfOnlyOne === true
   */
  public automaticDisabled: boolean;

  @Input() autoselectIfOnlyOne = true;

  /**
   * change event when value changes to provide user to handle things in change event
   */
  @Output() public change: EventEmitter<any> = new EventEmitter();

  /**
   * Event emitted when dropdown is open.
   */
  @Output() public open: EventEmitter<any> = new EventEmitter();

  /**
   * Event emitted when dropdown is open.
   */
  @Output() public close: EventEmitter<any> = new EventEmitter();

  /**
   * Toogle the dropdown list
   */
  public toggleDropdown: boolean = false;

  /**
   * Available items for selection
   */
  public availableItems: any = [];

  /**
   * Filtered items for selection
   */
  public filteredItems: any = [];

  /**
   * Selected Items
   */
  public selectedItems: any = [];

  /**
   * Selection text to be Displayed
   */
  public selectedDisplayText: string = 'Select';

  /**
   * Search text
   */
  public searchText: string;

  /**
   * variable to track if clicked inside or outside of component
   */
  public clickedInside: boolean = false;

  /**
   * variable to track keypress event inside and outside of component
   */
  public insideKeyPress: boolean = false;

  /**
   * variable to track the focused item whenuser uses arrow keys to select item
   */
  public focusedItemIndex: number = null;

  /**
   * element to show not found text when not itmes match the search
   */

  public showNotFound = false;
  /**
   * Hold the reference to available items in the list to focus on the item when scrolling
   */
  @ViewChildren('availableOption') public availableOptions: QueryList<ElementRef>;

  private isInitialized = false;

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.onChange(val);
    this.onTouched();
  }

  // tslint:disable-next-line:variable-name
  constructor(private cdref: ChangeDetectorRef, public _elementRef: ElementRef) {
    this.multiple = false;
  }

  public onChange: any = () => { // empty
  }

  public onTouched: any = () => { // empty
  }

  /**
   * click listener for host inside this component i.e
   * if many instances are there, this detects if clicked inside
   * this instance
   */
  @HostListener('click')
  public clickInsideComponent() {
    this.clickedInside = true;
  }

  /**
   * click handler on documnent to hide the open dropdown if clicked outside
   */
  @HostListener('document:click')
  public clickOutsideComponent() {
    if (!this.clickedInside) {
      this.toggleDropdown = false;
      this.resetArrowKeyActiveElement();
    }
    this.clickedInside = false;
  }

  /**
   * click handler on documnent to hide the open dropdown if clicked outside
   */
  @HostListener('document:keydown')
  public keyPressOutsideComponent() {
    if (!this.insideKeyPress) {
      this.toggleDropdown = false;
      this.resetArrowKeyActiveElement();
    }
    this.insideKeyPress = false;
  }

  /**
   * Event handler for key up and down event and enter press for selecting element
   * @param event
   */
  @HostListener('keydown', ['$event'])
  public handleKeyboardEvent($event: KeyboardEvent) {
    this.insideKeyPress = true;
    if ($event.keyCode === 27 || this.disabled || this.automaticDisabled) {
      this.toggleDropdown = false;
      this.insideKeyPress = false;
      return;
    }
    const avaOpts = this.availableOptions.toArray();
    if (/^\w$/.test($event.key) && !this.toggleDropdown) {
      this.toggleDropdown = true;
      this.clearAndFocusSearchTextInput();
      this.searchText = $event.key;
    }
    // Arrow Down
    if ($event.keyCode === 40 && avaOpts.length > 0) {
      this.onArrowKeyDown();
      if (this.focusedItemIndex >= 0 && avaOpts[this.focusedItemIndex] && avaOpts[this.focusedItemIndex].nativeElement) {
        avaOpts[this.focusedItemIndex].nativeElement.focus();
      }
      $event.preventDefault();
    }
    // Arrow Up
    if ($event.keyCode === 38 && avaOpts.length) {
      this.onArrowKeyUp();
      if (this.focusedItemIndex >= 0 && avaOpts[this.focusedItemIndex] && avaOpts[this.focusedItemIndex].nativeElement) {
        avaOpts[this.focusedItemIndex].nativeElement.focus();
      }
      $event.preventDefault();
    }
    // Enter
    if ($event.keyCode === 13 && this.focusedItemIndex !== null && this.toggleDropdown) {
      this.selectItem(this.filteredItems[this.focusedItemIndex]);
      $event.preventDefault();
      this.toggleDropdown = false;
      this.insideKeyPress = false;
      return false;
    }
    if ($event.keyCode === 9 && this.toggleDropdown) {
      if (this.focusedItemIndex !== null) {
        this.selectItem(this.filteredItems[this.focusedItemIndex]);
      }
      this.toggleDropdown = false;
      this.insideKeyPress = false;
      return false;
    }
    if ($event.key.toLowerCase() === 'delete') {
      // delete
      this.selectItem(null);
      this.toggleDropdown = false;
      this.insideKeyPress = false;
      return false;
    }
  }

  private setFilteredItems() {
    this.filteredItems = limitTo(filterBy(this.availableItems, this.searchText, this.config.searchOnKey), this.config.limitTo);
  }

  /**
   * Component onInit
   */
  public ngOnInit() {
    if (typeof this.options !== 'undefined' && Array.isArray(this.options)) {
      this.availableItems = [...this.options.sort(this.config.customComparator)];
      this.setFilteredItems();
      this.initDropdownValuesAndOptions();
    }
  }

  /**
   * after view init to subscribe to available option changes
   */
  public ngAfterViewInit() {
    this.availableOptions.changes.subscribe(this.setNotFoundState.bind(this));
    this.isInitialized = true;
    this.checkAutoSelect();
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  public writeValue(value: any) {
    /* istanbul ignore else */
    if (value) {
      if (Array.isArray(value)) {
        if (this.multiple) {
          this.value = value;
        } else {
          this.value = value[0];
        }
      } else {
        this.value = value;
      }
      /* istanbul ignore else */
      if (Array.isArray(value)) {
        this.selectedItems = value;
      } else {
        this.selectedItems.push(value);
      }
    } else {
      this.value = undefined;
      this.selectedItems = [];
      this.availableItems = [...this.options.sort(this.config.customComparator)];
      this.setFilteredItems();
    }
    this.initDropdownValuesAndOptions();
  }

  /**
   * function sets whether to show items not found text or not
   */
  public setNotFoundState() {
    if (this.availableOptions.length === 0) {
      this.showNotFound = true;
    } else {
      this.showNotFound = false;
    }
    this.cdref.detectChanges();
  }

  /**
   * Component onchage i.e when any of the input properties change
   * @param changes
   */
  public ngOnChanges(changes: SimpleChanges) {
    this.selectedItems = [];
    this.searchText = null;
    this.options = this.options || [];
    if (changes.options) {
      this.availableItems = [...this.options.sort(this.config.customComparator)];
      this.setFilteredItems();

      this.checkAutoSelect();
    }
    if (changes.value && JSON.stringify(changes.value.currentValue) === JSON.stringify([])) {
      this.availableItems = [...this.options.sort(this.config.customComparator)];
      this.setFilteredItems();
    }
    this.initDropdownValuesAndOptions();
  }

  private checkAutoSelect() {
    if (this.isInitialized && this.autoselectIfOnlyOne && this.options.length === 1) {
      this.selectItem(this.options[0]);
      this.automaticDisabled = true;
    } else {
      this.automaticDisabled = false;
    }
  }

  /**
   * Deselct a selected items
   * @param item:  item to be deselected
   * @param index:  index of the item
   */
  public deselectItem(item: any, index: number) {
    this.selectedItems.splice(index, 1);
    if (!this.availableItems.includes(item)) {
      this.availableItems.push(item);
      this.availableItems.sort(this.config.customComparator);
    }
    this.selectedItems = [...this.selectedItems];
    this.availableItems = [...this.availableItems];
    this.setFilteredItems();
    // this.writeValue(this.selectedItems);
    this.valueChanged();
    this.resetArrowKeyActiveElement();
  }

  /**
   * Select an item
   * @param item:  item to be selected
   */
  public selectItem(item) {

    // Remove selected item from availableItems
    this.availableItems = this.availableItems.filter(i => i !== item);

    // If not multiple select, add previously selected item to available list & clear selection
    if (!this.multiple) {
      if (this.selectedItems.length > 0) {
        this.availableItems.push(this.selectedItems[0]);
      }
      this.selectedItems = [];
      this.toggleDropdown = false;
    }

    if (item) {
      this.selectedItems.push(item);
    }
    this.selectedItems.sort(this.config.customComparator);
    this.availableItems.sort(this.config.customComparator);
    this.setFilteredItems();
    // this.writeValue(this.selectedItems);
    this.valueChanged();
    this.resetArrowKeyActiveElement();
  }

  /**
   * When selected items changes trigger the chaange back to parent
   */
  public valueChanged() {
    this.writeValue(this.selectedItems);
    // this.valueChange.emit(this.value);
    this.change.emit({ value: this.value });
  }

  /**
   * Toggle the dropdownlist on/off
   */
  public toggleSelectDropdown() {
    this.toggleDropdown = !this.toggleDropdown;
    if (this.toggleDropdown) {
      this.open.emit();
      this.clearAndFocusSearchTextInput();
    } else {
      this.close.emit();
    }
    this.resetArrowKeyActiveElement();
  }

  /**
   * initialize the config and other properties
   */
  private initDropdownValuesAndOptions() {
    const config: any = {
      displayKey: 'description',
      height: 'auto',
      search: false,
      placeholder: 'Select',
      searchPlaceholder: 'Search',
      limitTo: this.options.length,
      customComparator: undefined,
      noResultsFound: 'No results found!',
      moreText: 'more',
      searchOnKey: null,
    };
    if (this.config === 'undefined' || Object.keys(this.config).length === 0) {
      this.config = { ...config };
    }
    for (const key of Object.keys(config)) {
      this.config[key] = this.config[key] ? this.config[key] : config[key];
    }
    // Adding placeholder in config as default param
    this.selectedDisplayText = this.config['placeholder'];
    if (this.value !== '' && typeof this.value !== 'undefined') {
      if (Array.isArray(this.value)) {
        this.selectedItems = this.value;
      } else {
        this.selectedItems[0] = this.value;
      }

      this.selectedItems.forEach((item: any) => {
        const ind = this.availableItems.findIndex((aItem: any) => JSON.stringify(item) === JSON.stringify(aItem));
        if (ind !== -1) {
          this.availableItems.splice(ind, 1);
          this.setFilteredItems();
        }
      });
    }
    this.setSelectedDisplayText();
  }

  /**
   * set the text to be displayed
   */
  private setSelectedDisplayText() {
    if (this.selectedItems.length > 0) {
      let text: string = this.selectedItems[0];
      if (typeof this.selectedItems[0] === 'object') {
        text = this.selectedItems[0][this.config.displayKey];
      }

      if (this.multiple && this.selectedItems.length > 0) {
        const multipleText = this.selectedItems
          .filter((si, i) => i < this.multipleMoreLimit)
          .map(si => typeof si === 'object' ? si[this.config.displayKey] : si)
          .join(this.multipleDelimiter);
        this.selectedDisplayText = this.selectedItems.length <= this.multipleMoreLimit ? multipleText :
          multipleText + ` + ${this.selectedItems.length - this.multipleMoreLimit} ${this.config.moreText}`;
      } else {
        this.selectedDisplayText = this.selectedItems.length === 0 ? this.config.placeholder : text;
      }
    } else {
      this.selectedDisplayText = this.config['placeholder'];
    }
  }

  /**
   * Event handler for arrow key up event thats focuses on a item
   */
  private onArrowKeyUp() {
    if (this.focusedItemIndex <= 0) {
      this.focusedItemIndex = 0;
      return;
    }
    if (this.onArrowKey()) {
      this.focusedItemIndex--;
    }
  }

  /**
   * Event handler for arrow key down event thats focuses on a item
   */
  private onArrowKeyDown() {
    if (this.focusedItemIndex >= this.filteredItems.length - 1) {
      this.focusedItemIndex = this.filteredItems.length - 1;
      return;
    }
    if (this.onArrowKey()) {
      this.focusedItemIndex++;
    }
  }

  private onArrowKey() {
    if (this.focusedItemIndex === null) {
      this.focusedItemIndex = 0;
      return false;
    }
    return true;
  }

  /**
   * will reset the element that is marked active using arrow keys
   */
  private resetArrowKeyActiveElement() {
    this.focusedItemIndex = null;

  }

  private clearAndFocusSearchTextInput() {
    this.searchText = '';
    setTimeout(() => {
      if (this.searchTextInput && this.searchTextInput.length) {
        this.searchTextInput.first.nativeElement.focus();
      }
    });

  }
}
