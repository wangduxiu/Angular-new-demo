import { Component, Input } from '@angular/core';
import { util } from '../../../core/util/util';
import { FlorderMaterialLinesComponent } from '../../florders/florder-material-lines/florder-material-lines.component';

@Component({
  selector: 'app-relocation-material-lines',
  templateUrl: './relocation-material-lines.component.html',
  styleUrls: ['../../florders/florder-material-lines/florder-material-lines.component.less'],
})
export class RelocationMaterialLinesComponent extends FlorderMaterialLinesComponent {
  @Input() title: string;

  private deviceType = util.deviceType();
  public connectorHeight: number;
  public connectorWidth: number;
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
}
