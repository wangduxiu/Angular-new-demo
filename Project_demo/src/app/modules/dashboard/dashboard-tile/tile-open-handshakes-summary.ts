import { Component, EventEmitter, Output } from '@angular/core';
import { DashboardTile } from './dashboard-tile';

@Component({
  selector: 'app-dashboard-tile-open-handshakes-summary',
  templateUrl: './tile-open-handshakes-summary.html',
  styleUrls: ['./tile-open-handshakes-summary.less', './dashboard-tile.less']
})
export class OpenHandshakesSummaryTile extends DashboardTile {

  @Output() viewAll = new EventEmitter<void>();

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
