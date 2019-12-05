import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AdminDefinition } from '../../../../core/store/admin/admin-definitions/admin-definitions.interface';

@Component({
  selector: 'app-salesorganisation-list',
  templateUrl: './salesorganisation-list.component.html',
  styleUrls: ['./salesorganisation-list.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SalesOrganisationListComponent),
      multi: true,
    },
  ],
})
export class SalesOrganisationListComponent implements ControlValueAccessor, OnChanges {

  availableSalesOrganisations: AdminDefinition[] = [];
  userSalesOrganisations: AdminDefinition[] = [];
  @Input() readonly: boolean;
  @Input() readonly salesOrganisations: AdminDefinition[] = [];
  @Output() onChange = new EventEmitter();

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  focused = false;
  showNewLine = false;

  newSalesOrganisationForm;

  constructor(private formBuilder: FormBuilder) {
  }

  private getControlsConfig() {
    return {
      salesOrganisationId: [[] , []],
    }
  }

  ngOnInit(): void {
    this.newSalesOrganisationForm = this.formBuilder.group(this.getControlsConfig());
  }

  startAddSalesOrganisation() {
    if (!this.showNewLine) {
      this.showNewLine = true;
    }
  }

  addSalesOrganisation() {
    if (this.newSalesOrganisationForm.valid) {
      const selectedSalesOrganisations = this.salesOrganisations.filter((c) => {
        return this.newSalesOrganisationForm.value.salesOrganisationId.includes(c.id);
      });
      this.userSalesOrganisations = selectedSalesOrganisations;

      this.propagateChange(this.userSalesOrganisations);
    }
  }

  clearAddSalesOrganisationForm() {
    // clear form
    this.newSalesOrganisationForm = this.formBuilder.group(this.getControlsConfig());
    this.showNewLine = false;
  }

  removeSalesOrganisation(id) {
    this.userSalesOrganisations = this.userSalesOrganisations.filter(uso => uso.id !== id);
    this.onChange.emit(this.userSalesOrganisations);
    this.setAvailableSalesOrganisations();
    this.propagateChange(this.userSalesOrganisations);
  }

  onBlur(): void {
    this.focused = false;
    this.propagateTouched(); // transfer touched to listener aka the reactive form
  }

  writeValue(value: AdminDefinition[]): void {
    this.userSalesOrganisations = this.salesOrganisations.filter((uso) => {
      return value.some(c => c.id === uso.id && this.newSalesOrganisationForm.value.salesOrganisationId.length === 0);
    });
    this.newSalesOrganisationForm.setValue({
      salesOrganisationId: this.userSalesOrganisations.map(uso => (uso.id)),
    });

    this.ngOnChanges(null);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.salesOrganisations && this.salesOrganisations.length > 0) {
      this.setAvailableSalesOrganisations();
    }
  }

  private setAvailableSalesOrganisations() {
    this.availableSalesOrganisations = this.salesOrganisations;
  }

  registerOnChange(fn): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn): void {
    this.propagateTouched = fn;
  }
}
