import { Component, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { ValidatorService } from '../../../core/services/validator.service';
import { FlorderEditMaterialComponent } from '../../florders/florder-edit-material/florder-edit-material.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-flow-edit-material',
  templateUrl: './flow-edit-material.component.html',
  styleUrls: ['../../florders/florder-edit-material/florder-edit-material.component.less'],
})
export class FlowEditMaterialComponent extends FlorderEditMaterialComponent {

  editPackingType: boolean;

  constructor(formBuilder: FormBuilder, validatorService: ValidatorService, simplePageScrollService: SimplePageScrollService, translate: TranslateService) {
    super(formBuilder, validatorService, simplePageScrollService, translate);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes.panelStatus || changes.editOnlyQuantity) {
      this.editPackingType = this.panelStatus && this.panelStatus.isNew
        || this.panelStatus.isEdit && !this.panelStatus.isFlowEdit
        || this.panelStatus.isEdit && this.panelStatus.isFlowEdit && this.panelStatus.isHandshaker && !this.editOnlyQuantity;
    }
  }

  resetForm() {
    const excludedControls = [
      'packingId',
      'internalId',
      'type'
    ];
    for (const controlName in this.editMaterialForm.controls) {
      if (!excludedControls.includes(controlName)) {
        const currentValue = this.editMaterialForm.get(controlName).value;
        if (typeof currentValue !== 'boolean') { // field 'isNew' must remain false or true
          this.editMaterialForm.controls[controlName].setValue('');
        }
      }
    }
  }

  getContent(id: string): string {
    const brick = id && this.definitions.global.brick.find(b => b.id === id);
    return brick && brick.name;
  }

}
