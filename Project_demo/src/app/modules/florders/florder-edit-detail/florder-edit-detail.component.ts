import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MaterialTypes } from '../../../core/store/contract-details/contract-details.interface';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { FlorderDetail, Material } from '../../../core/store/florder-detail/florder-detail.interface';
import { PanelStatus } from '../florder-edit-container/florder-edit.interface';

export abstract class FlorderEditDetailComponent implements OnInit {
  @Input() materialTypes: MaterialTypes;
  @Input() editMaterial: Material;
  @Input() availablePickingDates: { full: string[]; nonFull: string[]; };
  @Input() definitions: Definitions;
  @Input() panelStatus: PanelStatus;
  @Input() panelStatusMaterial: PanelStatus;

  @Output() cancelClicked = new EventEmitter(); // Go back to orders-list
  @Output() saveMaterialClicked = new EventEmitter(); // Store material data in state
  @Output() startEditMaterialClicked = new EventEmitter(); // Start editing material
  @Output() removeMaterialClicked = new EventEmitter(); // Remove material from state
  @Output() nextClicked = new EventEmitter();
  @Output() backClicked = new EventEmitter();
  @Output() formValidChanged = new EventEmitter();

  abstract get florderDetail(): FlorderDetail;
  valid$= new Subject<boolean>();

  ngOnInit() {
    this.valid$.asObservable().distinctUntilChanged().subscribe(valid => {
      this.formValidChanged.emit(valid);
    });
    this.isValid(); // Trigger valid$ to be updated
  }

  isValid(): boolean {
    const valid = this.florderDetail.materials.length > 0;
    this.valid$.next(valid);
    return valid;
  }

  nextClickedFn() {
    if (this.isValid()) {
      this.nextClicked.emit()
    }
  }

}
