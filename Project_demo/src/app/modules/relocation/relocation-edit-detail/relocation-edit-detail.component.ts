import { Component, Input } from '@angular/core';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { FlorderEditDetailComponent } from '../../florders/florder-edit-detail/florder-edit-detail.component';

@Component({
  selector: 'app-relocation-edit-detail',
  templateUrl: './relocation-edit-detail.component.html',
  styleUrls: ['../../florders/florder-edit-detail/florder-edit-detail.component.less'],
})
export class RelocationEditDetailComponent extends FlorderEditDetailComponent {

  @Input() relocationDetail: FlorderDetail;

  get florderDetail(): FlorderDetail {
    return this.relocationDetail;
  }

  ngOnInit():any {
    super.ngOnInit();
  }
}
