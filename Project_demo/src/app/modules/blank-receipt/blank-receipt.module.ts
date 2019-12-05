import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule, SharedModule } from '../../shared';
import { CoreModule } from '../../core/core.module';
import { AdalModule } from '../../core/services/adal/adal.module';
import { CommonModule } from '@angular/common';
import { BlankReceiptRoutingModule } from './blank-receipt-routing.module';

import { BlankReceiptPageContainer } from './blank-receipt-page-container/blank-receipt-page.container';
import { BlankReceiptFormComponent } from './blank-receipt-form/blank-receipt-form.component';

@NgModule({
  imports: [
    CommonModule,
    BlankReceiptRoutingModule,
    AngularMaterialModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule,
  ],
  declarations: [
    BlankReceiptPageContainer,
    BlankReceiptFormComponent,
  ],
  entryComponents: [],
})
export class BlankReceiptModule { }
