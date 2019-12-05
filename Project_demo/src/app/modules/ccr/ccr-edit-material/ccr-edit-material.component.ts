import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ValidatorService } from '../../../core/services/validator.service';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { FlorderEditMaterialComponent } from '../../florders/florder-edit-material/florder-edit-material.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ccr-edit-material',
  templateUrl: './ccr-edit-material.component.html',
  styleUrls: ['../../florders/florder-edit-material/florder-edit-material.component.less'],
})
export class CCREditMaterialComponent extends FlorderEditMaterialComponent {

  constructor(formBuilder: FormBuilder, validatorService: ValidatorService, simplePageScrollService: SimplePageScrollService, translate: TranslateService) {
    super(formBuilder, validatorService, simplePageScrollService, translate);
  }
}
