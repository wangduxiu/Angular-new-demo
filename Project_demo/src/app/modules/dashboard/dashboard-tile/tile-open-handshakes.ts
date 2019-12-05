import { Component, EventEmitter, Output } from '@angular/core';
import { DashboardTile } from './dashboard-tile';

@Component({
  selector: 'app-dashboard-tile-open-handshakes',
  templateUrl: './tile-open-handshakes.html',
  styleUrls: ['./tile-open-handshakes.less', './dashboard-tile.less']
})
export class OpenHandshakesTile extends DashboardTile {

  @Output() viewAll = new EventEmitter<void>();
  @Output() view = new EventEmitter<string>(); // etmOrderNumber

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  firstThree(): string[] {
    const openHandshakes: string[] = this.customerSummary.openHandshakes.flows.map(value => value.etmOrderNumber);
    if (openHandshakes.length > 3) {
      openHandshakes.splice(3);
    }
    return openHandshakes;
  }

}
