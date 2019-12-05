import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DashboardTile } from './dashboard-tile';

@Component({
  selector: 'app-feature-tile',
  templateUrl: './feature-tile.html',
  styleUrls: ['./feature-tile.less', './dashboard-tile.less']
})
export class FeatureTile extends DashboardTile {

  @Input() translationCode: string;
  @Input() isNew: boolean;
  @Input() icon: string;
  @Input() colorClass: string;

  @Output() buttonClicked = new EventEmitter();

  ngOnInit(): void {
  }


}
