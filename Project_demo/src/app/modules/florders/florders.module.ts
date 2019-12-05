import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FlorderRecurrenceComponent } from 'app/modules/florders/recurrence/florder-recurrence.component';
import { CoreModule } from '../../core/core.module';
import { AdalModule } from '../../core/services/adal/adal.module';

import { AngularMaterialModule, SharedModule } from '../../shared';

import { ModalComponent } from '../../shared/modal/modal.component';
import { CCRRoutingModule } from '../ccr/ccr-routing.module';
import { FlowsRoutingModule } from '../flows/flows-routing.module';
import { OrdersRoutingModule } from '../orders/orders-routing.module';

@NgModule({
  imports: [
    CommonModule,
    OrdersRoutingModule,
    FlowsRoutingModule,
    CCRRoutingModule,
    AngularMaterialModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule,
  ],
  exports: [
    FlorderRecurrenceComponent,
  ],
  declarations: [
    FlorderRecurrenceComponent,
  ],
  entryComponents: [ModalComponent], // needed for the modal
})
export class FlordersModule {
}
