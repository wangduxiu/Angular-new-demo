import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CDFlorderType } from '../../../core/store/contract-details/contract-details.interface';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { FlorderEditDetailComponent } from '../../florders/florder-edit-detail/florder-edit-detail.component';

@Component({
  selector: 'app-ccr-edit-detail',
  templateUrl: './ccr-edit-detail.component.html',
  styleUrls: ['../../florders/florder-edit-detail/florder-edit-detail.component.less'],
})
export class CCREditDetailComponent extends FlorderEditDetailComponent {
  _orderTypes: CDFlorderType[];

  @Input() orderDetail: FlorderDetail;
  @Input() ccrForm: FormGroup;

  @Input()
  set orderTypes(orderTypes: CDFlorderType[]) {
    this._orderTypes = orderTypes;
  }

  get orderTypes(): CDFlorderType[] {
    return this._orderTypes;
  }

  get florderDetail(): FlorderDetail {
    return this.orderDetail;
  }

  isValid(): boolean {
    const valid = this.florderDetail.ccr.ccrLineItems.length > 0;
    return valid;
  }
}
