import { Component, Input } from '@angular/core';
import { CustomerSummary } from '../../../core/store/customer-summary/customer-summary.interface';

@Component({
  selector: 'app-dashboard-tile',
  templateUrl: './dashboard-tile.html',
  styleUrls: ['./dashboard-tile.less']
})
export class DashboardTile  {

  @Input() customerSummary: CustomerSummary;

  constructor() {
  }

  ngOnInit(): void {
  }


}
