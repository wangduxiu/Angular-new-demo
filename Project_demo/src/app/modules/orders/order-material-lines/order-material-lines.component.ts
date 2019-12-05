import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FlorderMaterialLinesComponent } from '../../florders/florder-material-lines/florder-material-lines.component';
import { util } from '../../../core/util/util';

@Component({
  selector: 'app-order-material-lines',
  templateUrl: './order-material-lines.component.html',
  styleUrls: ['../../florders/florder-material-lines/florder-material-lines.component.less'],
})
export class OrderMaterialLinesComponent extends FlorderMaterialLinesComponent implements OnChanges {

  @Input() palletQuantity: number;
  @Input() loadedEpp: number;
  @Input() maxEpp: number;
  @Input() fullTruck: boolean;

  private deviceType = util.deviceType();
  public connectorHeight: number;
  public connectorWidth: number;
  loadedStyle: {};
  notLoadedStyle: {};

  constructor() {
    super();
    switch (this.deviceType) {
      case 'mobile': {
        this.connectorHeight = 140;
        this.connectorWidth = 30;
        break;
      }
      case 'tablet': {
        this.connectorHeight = 140;
        this.connectorWidth = 30;
        break;
      }
      case 'desktop': {
        this.connectorHeight = 50;
        this.connectorWidth = 20;
        break;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const loaded = this.loadedEpp || 0;
    const total = this.maxEpp || 0;
    const percentage = Math.min(total > 0 ? loaded / total * 100 : 0, 100);
    this.loadedStyle = {
      width: (percentage) + '%'
    }
    this.notLoadedStyle = {
      width: (100 - percentage) + '%'
    }

  }

}
