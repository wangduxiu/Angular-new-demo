import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import { FlorderDetail } from '../../../core/store/florder-detail/florder-detail.interface';
import { AuthorizationMatrix } from '../../../core/store/contract-details/contract-details.interface';

@Component({
  selector: 'app-calendar-draggable-templates',
  templateUrl: './calendar-draggable-templates.component.html',
  styleUrls: ['./calendar-draggable-templates.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // don't always check for changes, only when input changed (but there's no input here)
})
export class CalendarDraggableTemplatesComponent implements OnInit {

  @Input() templates: any;
  @Input() editing: number = null;
  @Input() deleting: boolean = false;
  @Input() selectedTemplate: FlorderDetail;
  @Input() deliveryDaysRequesting: boolean = false;
  @Input() authorization: AuthorizationMatrix;

  @Output() createTemplate = new EventEmitter();
  @Output() deleteTemplate = new EventEmitter();
  @Output() selectTemplate = new EventEmitter();
  @Output() editTemplate = new EventEmitter();

  height: Number = 0;

  constructor(private cd: ChangeDetectorRef) {
  }

  @HostListener('window:resize', ['$event'])

  onResize(event) {
    this.resize(event.currentTarget.innerHeight);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.resize(window.innerHeight);
    this.cd.detectChanges();
  }

  resize(innerHeight) {
    this.height = innerHeight - 550;
  }
}
