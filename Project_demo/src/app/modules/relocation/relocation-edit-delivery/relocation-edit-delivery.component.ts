import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CDTo } from '../../../core/store/contract-details/contract-details.interface';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { Place } from '../../../core/store/florders/place.interface';
import { FlorderEditDeliveryComponent } from '../../florders/florder-edit-delivery/florder-edit-delivery.component';
import { PoNumberAsyncValidator } from '../../florders/florder-edit-delivery/po-number-async-validator';

@Component({
  selector: 'app-relocation-edit-delivery',
  templateUrl: './relocation-edit-delivery.component.html',
  styleUrls: ['../../florders/florder-edit-delivery/florder-edit-delivery.component.less']
})
export class RelocationEditDeliveryComponent extends FlorderEditDeliveryComponent {

  @Input() locations: Place[];
  @Input() relocationDetail: FlorderDetail;

  constructor(formBuilder: FormBuilder, translate: TranslateService, protected poNumberAsyncValidator: PoNumberAsyncValidator, cd: ChangeDetectorRef) {
    super(formBuilder, translate, poNumberAsyncValidator, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.relocationDetail && changes.relocationDetail.previousValue && changes.relocationDetail.previousValue.etmOrderNumber && !changes.relocationDetail.currentValue.etmOrderNumber) {
      this.ngOnInit();
    }
  }

  protected getControlsConfig() {
    return Object.assign(super.getControlsConfig(), {
      type: ['EPS-EPS'],
      shippingCondition: ['Z1'],
    });
  }

  doNextClicked() {
    if (this.deliveryForm.valid && !this.deliveryForm.pending) {
      this.nextClicked.emit(this.deliveryForm.value);
    }
  }

  protected getEtmOrderNumber(): string {
    return this.relocationDetail && this.relocationDetail.etmOrderNumber;
  }

  protected getTo(): CDTo {
    return null; // Not applicable
  }

}
