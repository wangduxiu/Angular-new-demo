import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { ValidatorService } from '../../../core/services/validator.service';
import { FlorderEditMaterialComponent } from '../../florders/florder-edit-material/florder-edit-material.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-relocation-edit-material',
  templateUrl: './relocation-edit-material.component.html',
  styleUrls: ['../../florders/florder-edit-material/florder-edit-material.component.less'],
})
export class RelocationEditMaterialComponent extends FlorderEditMaterialComponent {

  constructor(formBuilder: FormBuilder, validatorService: ValidatorService, simplePageScrollService: SimplePageScrollService, translate: TranslateService) {
    super(formBuilder, validatorService, simplePageScrollService, translate);
  }
}
