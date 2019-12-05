import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContractDetails } from '../../../core/store/contract-details/contract-details.interface';
import { Place } from '../../../core/store/florders/place.interface';
import { Stock } from '../../../core/store/stock/stock.interface';

@Component({
  selector: 'app-stock-page',
  templateUrl: './stock-page.component.html',
  styleUrls: ['./stock-page.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockPageComponent {
  selectedTab: number = 0;

  @Input() authorization;
  @Input() location: Place;
  @Input() totalItems: number;
  @Input() isLoading: boolean = false;
  @Input() items;
  @Input() locations: Place[] = [];

  @Output() filterStock = new EventEmitter();

  constructor() {

  }
}
