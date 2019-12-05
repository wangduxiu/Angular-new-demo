import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Florder } from '../../../core/store/florders/florder.interface';
import { Subject } from 'rxjs';
import { FlorderInfo, DayWithFlordersInfo } from '../../../core/store/calendar/calendar.interface';

@Component({
  selector: 'app-calendar-order-list',
  templateUrl: './calendar-order-list.component.html',
  styleUrls: ['./calendar-order-list.component.less'],
})
export class CalendarOrderListComponent {

  SLICE_NUMBER: number = 3;

  showTooltip = null;
  private showHideTooltip$ = new Subject<{florder: Florder, boundingBox: DOMRectInit}>();

  @Input() day: DayWithFlordersInfo;
  @Output() openFlorder = new EventEmitter<FlorderInfo>();

  tooltipStyle: any;

  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.showHideTooltip$
      .debounceTime(300)
      .subscribe(({ florder, boundingBox }) => {
        this.showTooltip = florder;
        if (boundingBox) {
          let { x, y } = boundingBox;
          if (x > 1005) {
            x = x - 755;
          } else {
            x = x + 160;
          }
          const scale = '0.7';
          this.tooltipStyle = {left: x + 'px', top: y + 'px',  transform: `scale(${scale}, ${scale})` };
        }
      });
  }

  mouseenter(florder, event) {
    this.showHideTooltip$.next({florder, boundingBox: event.target.getBoundingClientRect()});
  }

  mouseleave(florder) {
    this.showHideTooltip$.next({florder: null, boundingBox: null});
  }

  tooltipBoundingBoxChange(boundingBox: DOMRectInit) {
    if (boundingBox.y + boundingBox.height > window.innerHeight) {
      this.tooltipStyle = {
        ...this.tooltipStyle,
        top: `${window.innerHeight - boundingBox.height}px`,
      };
    }
    if (boundingBox.y < 0) {
      this.tooltipStyle = {
        ...this.tooltipStyle,
        top: 0,
      };
      this.cd.markForCheck();
    }
  }

  isRelocation(florder: Florder) {
    return florder.orderType === 'EPS-EPS';
  }
}
