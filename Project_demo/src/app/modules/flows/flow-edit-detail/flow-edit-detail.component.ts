import { Component, Input } from '@angular/core';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { FlorderEditDetailComponent } from '../../florders/florder-edit-detail/florder-edit-detail.component';

@Component({
  selector: 'app-flow-edit-detail',
  templateUrl: './flow-edit-detail.component.html',
  styleUrls: ['../../florders/florder-edit-detail/florder-edit-detail.component.less'],
})
export class FlowEditDetailComponent extends FlorderEditDetailComponent {

  @Input() flowDetail: FlorderDetail;

  get florderDetail(): FlorderDetail {
    return this.flowDetail;
  }
}
