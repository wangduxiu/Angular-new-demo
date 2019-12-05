import { AfterViewChecked, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { BaseContainer } from '../../base/BaseContainer';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/store';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { ContractInfo } from '../../../core/store/contract-info/contract-info.interface';
import { initialState as emptyContractInfo } from '../../../core/store/contract-info/contract-info.model';
import { PanelStatus } from '../../florders/florder-edit-container/florder-edit.interface';
import { FlorderInfo } from '../../../core/store/calendar/calendar.interface';

export abstract class AbstractCalendarFlorderTooltipContainer extends BaseContainer implements AfterViewChecked {
  @Input() florderInfo: FlorderInfo;

  @Output() boundingBoxChange = new EventEmitter<DOMRectInit>();

  definitions: Definitions;
  contractInfo: ContractInfo = emptyContractInfo;
  panelStatus: PanelStatus;
  private boundingRect: DOMRectInit;

  constructor(
    store: Store<fromRoot.RootState>,
    azureMonitoringService: AzureMonitoringService,
    private host:ElementRef
  ) {
    super(store, azureMonitoringService);
  }

  ngOnInit() {
    this.store
      .takeWhile(() => !this.destroyed)
      .map(state => state.definitions)
      .distinctUntilChanged()
      .subscribe(definitions => {
        this.definitions = definitions;
      });

    // Get orderDetail
    this.getFlorderFromStore();
    // Load orderDetail
    this.loadFlorder();

    this.panelStatus = {
      busy: false,
      createTemplate: false,
      editTemplate: false,
      isEdit: false,
      isEditable: false,
      isFlowEdit: false,
      isHandshaker: false,
      isNew: false,
      isUpdate: false,
      isView: true,
      isVisible: true,
      opening: false,
      saving: false

    }
  }

  ngAfterViewChecked(): void {
    this.checkBoundingRectChange();
  }

  private checkBoundingRectChange() {
    const boundingRect = this.host.nativeElement.getBoundingClientRect();
    if (boundingRect === null && this.boundingRect === null) {
      return;
    }
    let changed;
    changed = (boundingRect == undefined) !== (this.boundingRect == undefined);
    changed = changed || boundingRect.x !== this.boundingRect.x;
    changed = changed || boundingRect.y !== this.boundingRect.y;
    changed = changed || boundingRect.width !== this.boundingRect.width;
    changed = changed || boundingRect.height !== this.boundingRect.height;
    if (changed){
      this.boundingRect = boundingRect;
      this.boundingBoxChange.emit(boundingRect);
    }
  }

  protected abstract getFlorderFromStore();
  protected abstract loadFlorder();
}
