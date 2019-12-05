import { Component, Input } from '@angular/core';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { FlorderEditDetailComponent } from '../../florders/florder-edit-detail/florder-edit-detail.component';

@Component({
  selector: 'app-order-edit-detail',
  templateUrl: './order-edit-detail.component.html',
  styleUrls: ['../../florders/florder-edit-detail/florder-edit-detail.component.less'],
})
export class OrderEditDetailComponent extends FlorderEditDetailComponent {
  @Input() orderDetail: FlorderDetail;
  @Input() loadedEpp: number;
  @Input() maxEpp: number;

  get florderDetail(): FlorderDetail {
    return this.orderDetail;
  }

  ngOnInit(): any {
    super.ngOnInit();
  }

  isCcr(): boolean {
    return this.florderDetail.ccr && this.florderDetail.ccr.ccrLineItems && this.florderDetail.ccr.ccrLineItems.length > 0;
  }
}
