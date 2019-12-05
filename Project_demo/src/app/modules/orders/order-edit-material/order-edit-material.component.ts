import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { ValidatorService } from '../../../core/services/validator.service';
import { FlorderEditMaterialComponent } from '../../florders/florder-edit-material/florder-edit-material.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-edit-material',
  templateUrl: './order-edit-material.component.html',
  styleUrls: ['../../florders/florder-edit-material/florder-edit-material.component.less'],
})
export class OrderEditMaterialComponent extends FlorderEditMaterialComponent {

  constructor(formBuilder: FormBuilder, validatorService: ValidatorService, simplePageScrollService: SimplePageScrollService, translate: TranslateService) {
    super(formBuilder, validatorService, simplePageScrollService, translate);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  resetForm() {
    const excludedControls = ['type', 'internalId', 'palletId'];
    for (const controlName in this.editMaterialForm.controls) {
      if (!excludedControls.includes(controlName)) {
        const currentValue = this.editMaterialForm.get(controlName).value;
        if (typeof currentValue !== 'boolean') { // field 'isNew' must remain false or true
          this.editMaterialForm.controls[controlName].setValue(' ');
        }
      }
    }
  }

}
