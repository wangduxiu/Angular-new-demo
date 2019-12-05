import { EventEmitter, Input, Output } from '@angular/core';
import { Material } from '../../../core/store/florder-detail/florder-detail.interface';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { PanelStatus } from '../florder-edit-container/florder-edit.interface';


export abstract class FlorderMaterialLinesComponent  {
  @Input() materials: Material[];
  @Input() definitions: Definitions;
  @Input() panelStatus: PanelStatus;
  @Input() readonly: boolean;

  @Output() editMaterialClicked = new EventEmitter();
  @Output() removeMaterialClicked = new EventEmitter();

}
