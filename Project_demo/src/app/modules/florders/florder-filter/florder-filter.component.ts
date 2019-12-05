import { EventEmitter, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorService } from '../../../core/services/validator.service';
import { Definition } from '../../../core/store/definitions/definition.interface';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { FlordersFilter } from '../../../core/store/florders/florders-filter.interface';


export abstract class FlorderFilterComponent implements OnInit, OnChanges {

  private initialized: boolean = false;

  filterForm: FormGroup;
  transport: { pickup: Definition, eps: Definition };
  showAdvanced: boolean = false;

  @Input() definitions: Definitions;
  @Input() isLoading: boolean;
  @Input() filter: FlordersFilter;
  @Input() shipTos: Definition[];

  constructor(protected formBuilder: FormBuilder, protected validatorService: ValidatorService) {
  }

  ngOnInit(): void {
    this.createForm();
    this.initialized = true;
    this.showAdvanced = this.filter && this.filter.moreSearchOptions;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.initialized && changes.filter) {
      this.createForm();
      this.showAdvanced = this.filter && this.filter.moreSearchOptions;
    }
    if (changes.definitions) {
      this.setTypes();
    }
  }

  setTypes(): void {
    this.transport = {
      eps: this.definitions.transport.type.find(def => def.id.toLowerCase() === 'z1'),
      pickup: this.definitions.transport.type.find(def => def.id.toLowerCase() === 'z2'),
    };
  }

  createForm() {
    const controlsConfig = this.getControlsConfig();
    this.filterForm = this.formBuilder.group(controlsConfig);
  }

  protected getControlsConfig() {
    return {
      florderDateFrom: [this.filter.florderDateFrom, [this.validatorService.datePatternValidator]],
      florderDateTo: [this.filter.florderDateTo, [this.validatorService.datePatternValidator, this.validatorService.dateSameOrAfter('orderDateFrom')]],
      unloadingDateFrom: [this.filter.unloadingDateFrom, [this.validatorService.datePatternValidator]],
      unloadingDateTo: [this.filter.unloadingDateTo, [this.validatorService.datePatternValidator, this.validatorService.dateSameOrAfter('unloadingDateFrom')]],
      packingIds: [this.filter.packingIds],
      froms: [this.filter.froms],
      tos: [this.filter.tos],
      incoterms: [this.filter.incoterms],
      shipTos: [this.filter.shipTos],
      etmShippingNumber: [this.filter.etmShippingNumber],
      salesOrderNumber: [this.filter.salesOrderNumber],
      etmDocumentNumber: [this.filter.etmDocumentNumber],
      senderReferenceNumber: [this.filter.senderReferenceNumber],
      customerReferenceNumber: [this.filter.customerReferenceNumber],
      moreSearchOptions: [this.filter.moreSearchOptions]
    };
  }

  filterClicked(eventEmitter: EventEmitter<{ value: FlordersFilter; valid: boolean }>): void {
    if (!this.isLoading) {
      eventEmitter.emit({
        value: {
          ...this.filterForm.value,
          pageSize: this.filter.pageSize,
          moreSearchOptions: this.showAdvanced
        },
        valid: this.filterForm.valid
      });
    }
  }

}
