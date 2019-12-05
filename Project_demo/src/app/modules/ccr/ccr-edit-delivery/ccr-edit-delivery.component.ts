import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CDFlorderType } from '../../../core/store/contract-details/contract-details.interface';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { DeliveryMethod } from '../../../core/store/florder-detail/florder-detail.interface';
import { PanelStatus } from '../../florders/florder-edit-container/florder-edit.interface';

@Component({
  selector: 'app-ccr-edit-delivery',
  templateUrl: './ccr-edit-delivery.component.html',
  styleUrls: ['../../florders/florder-edit-delivery/florder-edit-delivery.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
})
export class CCREditDeliveryComponent {

  @Input() orderTypes: CDFlorderType[];
  @Input() ccrForm: FormGroup;
  @Input() deliveryMethod: DeliveryMethod;
  @Input() panelStatus: PanelStatus;
  @Input() definitions: Definitions;

  constructor(private translate: TranslateService, private cd: ChangeDetectorRef) {
  }

  ngOnChanges() {
    this.cd.detectChanges();
  }
}
