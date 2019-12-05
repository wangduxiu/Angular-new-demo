import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdSlideToggleModule,
  MdButtonModule,
  MdButtonToggleModule,
  MdCheckboxModule,
  MdGridListModule,
  MdInputModule,
  MdNativeDateModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdSelectModule,
  MdTabsModule,
  MdIconModule,
  MdDialogModule,
  MdMenuModule,
  MdTooltipModule,
  MdAutocompleteModule,
  MdCardModule,
  MdProgressBarModule,
} from '@angular/material';

import { FormsModule } from '@angular/forms';

const modules = [
  BrowserAnimationsModule,
  MdProgressSpinnerModule,
  MdGridListModule,
  MdSelectModule,
  MdNativeDateModule,
  MdCheckboxModule,
  MdButtonModule,
  MdInputModule,
  FormsModule,
  MdRadioModule,
  MdButtonToggleModule,
  MdTabsModule,
  MdSlideToggleModule,
  MdIconModule,
  MdMenuModule,
  MdDialogModule,
  MdTooltipModule,
  MdCardModule,
  MdAutocompleteModule,
  MdProgressBarModule,
];

@NgModule({
  imports: modules,
  exports: modules,
  declarations: [],
})
export class AngularMaterialModule {
}
