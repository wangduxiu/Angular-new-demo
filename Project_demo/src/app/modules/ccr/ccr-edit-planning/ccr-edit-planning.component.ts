import {TranslateService} from '@ngx-translate/core';
import {TranslationHelperService} from '../../../core/services/translate-helper.service';
import {ChangeDetectorRef, Component, Input, OnChanges} from '@angular/core';
import {FlorderDetail} from '../../../core/store/florder-detail/florder-detail.interface';
import {FormGroup} from '@angular/forms';
import {PanelStatus} from '../../florders/florder-edit-container/florder-edit.interface';

@Component({
  selector: 'app-ccr-edit-planning',
  templateUrl: './ccr-edit-planning.component.html',
  styleUrls: ['../../florders/florder-edit-planning/florder-edit-planning.component.less'],
})
export class CCREditPlanningComponent implements OnChanges {

  ordinalEnum: { id: string; value: string }[] = [];
  weekdayEnum: { id: string; value: string }[] = [];

  @Input() availablePickingDates: string[];
  @Input() orderDetail: FlorderDetail;
  @Input() sealNumberRequired: boolean;
  @Input() ccrForm: FormGroup;
  @Input() panelStatus: PanelStatus;

  constructor(private translationHelper: TranslationHelperService, private translate: TranslateService, private cd: ChangeDetectorRef) {
  }


  ngOnInit(): any {
    this.translationHelper.translateArray(['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'LAST'], (value, translation) => {
      return { id: value, value: translation };
    }, 'SHARED.ORDINAL.',).subscribe(array => (this.ordinalEnum = array));
    const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    this.translationHelper.translateArray(weekDays, (value, translation) => {
      return { id: value, value: translation };
    }, 'SHARED.DAYS.',).subscribe(array => (this.weekdayEnum = array));
    this.cd.markForCheck(); // Needed when changeDetectionStrategy == onPush
  }

  ngOnChanges() {
    this.cd.detectChanges();
  }
}
