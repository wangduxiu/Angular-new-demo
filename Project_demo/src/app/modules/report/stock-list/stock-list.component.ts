import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Place} from '../../../core/store/florders/place.interface';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
})
export class StockListComponent {

  @Input() items: any;

  @Input() location: Place;

  constructor(private translate: TranslateService) {
  }

  calculateBarWidth(amount: number) {
    const maxAmount: number = Math.max.apply(Math, this.items.map((item) => {
      return Math.abs(item.amount);
    }));
    return Math.abs(amount)/maxAmount * 100;
  }
}
