import { Component, Input } from '@angular/core';
import { FlorderMaterialLinesComponent } from '../../florders/florder-material-lines/florder-material-lines.component';
import { util } from '../../../core/util/util';

@Component({
  selector: 'app-flow-material-lines',
  templateUrl: './flow-material-lines.component.html',
  styleUrls: ['../../florders/florder-material-lines/florder-material-lines.component.less'],
})
export class FlowMaterialLinesComponent extends FlorderMaterialLinesComponent {
  @Input() title: string;
  @Input() handshaker: boolean;

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

  getContent(id: string): string {
    const brick = id && this.definitions.global.brick.find(b => b.id === id);
    return brick && brick.name;
  }
}
