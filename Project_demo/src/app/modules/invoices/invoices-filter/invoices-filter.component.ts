import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Definition } from '../../../core/store/definitions/definition.interface';
import { InvoiceFilter, Currency } from '../../../core/model/Invoice.interface';
import { Place } from '../../../core/store/florders/place.interface';
import { MdCheckboxChange } from '@angular/material';

@Component({
  selector: 'invoices-filter',
  templateUrl: './invoices-filter.component.html',
  styleUrls: ['./invoices-filter.component.less']
})
export class InvoicesFilterComponent implements OnChanges {
  // Inputs & Outputs
  @Input() filter: InvoiceFilter;
  @Input() loading: boolean;
  @Input() invoiceTypes: Definition[] = [];
  @Input() places: Place[];
  @Input() localCurrency: string;
  currencies: any[] = [];

  @Output() filterInvoices = new EventEmitter();

  // GLOBALS
  invoiceForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private translate: TranslateService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.invoiceTypes && changes.invoiceTypes) {
      this.createForm();
    }

    if (changes.localCurrency) {
      this.currencies = [];
      this.currencies.push({
        id: 'EUR',
        name: this.translate.instant('INVOICES.FILTER.LABELS.EURO'),
        checked: true,
      });

      if (this.localCurrency !== 'EUR') {
        const { localCurrency } = this;
        this.currencies.push({
          id: localCurrency,
          name: localCurrency,
          checked: true,
        });
      }
    }
  }

  createForm(): void {

    const controlsConfig = {
      currency: this.localCurrency !== 'EUR' ? 
        new FormArray([new FormControl('EUR'), new FormControl(this.localCurrency)]) :
        new FormArray([new FormControl('EUR')]),
      // euro
      invoiceDateFrom: [this.filter.invoiceDateFrom],
      invoiceDateTo: [this.filter.invoiceDateTo],
      invoiceNumber: [this.filter.invoiceNumber],
      // loadCurrency
      netAmountFrom: [this.filter.netAmountFrom],
      netAmountTo: [this.filter.netAmountTo],
      soldTo: [this.filter.soldTo || 'all'],
    };
    // loop over invoice types
    this.invoiceTypes && this.invoiceTypes.forEach(invoiceType => (controlsConfig['invoiceType_' + invoiceType.id] = [!this.filter.type || this.filter.type === invoiceType.id]));

    this.invoiceForm = this.formBuilder.group(controlsConfig);
  }

  onCurrencyChange(event: MdCheckboxChange, currency: Currency) {
    const formArray: FormArray = this.invoiceForm.get('currency') as FormArray;

    if (event.checked) {
      formArray.push(new FormControl(currency.id));
    } else {
      // find the unselected element
      let i: number = 0;
  
      formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value === currency.id) {
          formArray.removeAt(i);
          return;
        }
  
        i++;
      });
    }
  }

  filterClicked(): void {
    // Define invoice type
    const selectedTypes = this.invoiceTypes.filter(invoiceType => this.invoiceForm.value['invoiceType_' + invoiceType.id]).map(invoiceType => invoiceType.id);

    if (!this.loading) {
      this.filterInvoices.emit({
        ...this.invoiceForm.value,
        pageSize: this.filter.pageSize,
        pageNr: 1,
        sortField: this.filter.sortField,
        sortAscending: this.filter.sortAscending,
        type: selectedTypes.length === 1 && selectedTypes[0] || null,
      });
    }
  }
}
