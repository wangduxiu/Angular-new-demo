import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Autocomplete2 } from 'app/shared/form-components/autocomplete2/autocomplete2.component';
import { SelectDropDownComponent } from 'app/shared/form-components/autocomplete2/ngx-select-dropdown-component/ngx-select-dropdown.component';
import { MyDatePickerModule } from 'mydatepicker-selectweek';
import { CoreModule } from '../../core/core.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { Autocomplete } from './autocomplete/autocomplete.component';
import { ButtonComponent } from './button/button.component';
import { Checkbox } from './checkbox/checkbox.component';
import { DateInputComponent } from './date-input/date-input.component';
import { ErrorTagComponent } from './error-tag/error-tag.component';
import { Label } from './label/label.component';
import { RadioGroup } from './radio/radio-group.component';
import { Radio } from './radio/radio.component';
import { Select } from './select/select.component';
import { Toggle } from './slide-toggle/toggle.component';

import { TextInput } from './text-input/text-input.component';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    CoreModule,
    ReactiveFormsModule,
    MyDatePickerModule,
  ],
  exports: [
    TextInput,
    Label,
    Checkbox,
    DateInputComponent,
    Select,
    Toggle,
    Radio,
    RadioGroup,
    ErrorTagComponent,
    ButtonComponent,
    Autocomplete,
    Autocomplete2,
  ],
  declarations: [
    TextInput,
    Label,
    Checkbox,
    DateInputComponent,
    Select,
    Toggle,
    Radio,
    RadioGroup,
    ErrorTagComponent,
    ButtonComponent,
    Autocomplete,
    Autocomplete2,
    SelectDropDownComponent,
  ],
})
export class FormComponentsModule { }
