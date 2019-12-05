import { Component, Input } from '@angular/core';
import { CCREditMaterialLine } from '../../../core/store/ccr-detail/ccr-detail.interface';
import { MaterialTypes } from '../../../core/store/contract-details/contract-details.interface';
import { util } from '../../../core/util/util';
import { FlorderMaterialLinesComponent } from '../../florders/florder-material-lines/florder-material-lines.component';

@Component({
  selector: 'app-ccr-material-lines',
  templateUrl: './ccr-material-lines.component.html',
  styleUrls: ['../../florders/florder-material-lines/florder-material-lines.component.less'],
})
export class CCRMaterialLinesComponent extends FlorderMaterialLinesComponent {
  @Input() palletQuantity: number;
  @Input() title: string;
  @Input() materialTypes: MaterialTypes;

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

  materialIsEditable(material: CCREditMaterialLine): boolean {
    switch (material.type) {
      case 'combination':
        const palletId = this.materialTypes && this.materialTypes.combination && this.materialTypes.combination.palletIds.find(palletId => palletId.id === material.palletId);
        const packingId = palletId && palletId.packingIds.find(packingId => packingId.id === material.packingId);
        const packingStatus = packingId && packingId.packingStatusses.find(packingStatus => packingStatus.id === material.packingStatus);
        const logisticsVarietyPacking = packingStatus && packingStatus.logisticsVarietyPackings.find(logisticsVarietyPacking => logisticsVarietyPacking.id === material.logisticsVarietyPacking);
        const packingsPerPallet = logisticsVarietyPacking && logisticsVarietyPacking.packingsPerPallets.find(packingsPerPallet => packingsPerPallet.id == material.packingsPerPallet);// tslint:disable-line triple-equals  string == number
        return !!packingsPerPallet;
      case 'packing':
        return !!(this.materialTypes.packings && this.materialTypes.packings.find(packing => packing.id === material.packingId));
      case 'pallet':
        return !!(this.materialTypes.pallets && this.materialTypes.pallets.find(pallet => pallet.id === material.palletId));

    }
    return false;
  }
}
