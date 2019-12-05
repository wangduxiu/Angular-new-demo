import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FilterValues } from 'app/core/store/florders/filtervalues.interface';
import { ValidatorService } from '../../../core/services/validator.service';
import { FlordersFilter } from '../../../core/store/florders/florders-filter.interface';
import { FlorderFilterComponent } from '../../florders/florder-filter/florder-filter.component';
import { Customer } from '../../../core/store/user-context/user-context.interface';

@Component({
  selector: 'app-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['../../florders/florder-filter/florder-filter.component.less', './order-filter.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush // don't always check for changes, only when input changed (but there's no input here)
})
export class OrderFilterComponent extends FlorderFilterComponent implements OnInit, OnChanges {

  @Input() filterValues: FilterValues;
  @Input() customers: Customer[];
  @Output() filterOrders = new EventEmitter<{ value: FlordersFilter; valid: boolean }>();

  constructor(formBuilder: FormBuilder, validatorService: ValidatorService, private translate: TranslateService) {
    super(formBuilder, validatorService);
  }

  protected getControlsConfig() {
    const controlsConfig = super.getControlsConfig();
    Object.assign(controlsConfig, {
      orderTypes: [this.filter.orderTypes],
      shippingCondition: [this.filter.shippingCondition],
      incoterms: [this.filter.incoterms],
      palletIds: [this.filter.palletIds],
      packingIds: [this.filter.packingIds],
      transporter: [this.filter.transporter],
      customers: [this.customers ? (this.filter.customers || []) : null], // null = not a transporter, no multiple customer result, [] or non-empty array: filter on (multiple) customers
      ccrYes: [this.filter.ccrYes],
      ccrNo: [this.filter.ccrNo],
      sealNumber: [this.filter.sealNumber],
      orderStatuses: [this.filter.orderStatuses],
    });
    return controlsConfig;
  }

  filterClicked(): void {
    super.filterClicked(this.filterOrders);
  }
}
