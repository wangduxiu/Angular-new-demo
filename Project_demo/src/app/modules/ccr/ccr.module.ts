import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule, SharedModule } from '../../shared';
import { CoreModule } from '../../core/core.module';
import { AdalModule } from '../../core/services/adal/adal.module';

import { ModalComponent } from '../../shared/modal/modal.component';
import { CommonModule } from '@angular/common';
import { FlordersModule } from '../florders/florders.module';
import { CCRRoutingModule } from './ccr-routing.module';
import { CCREditDeliveryComponent } from './ccr-edit-delivery/ccr-edit-delivery.component';
import { CCREditDetailComponent } from './ccr-edit-detail/ccr-edit-detail.component';
import { CCREditPlanningComponent } from './ccr-edit-planning/ccr-edit-planning.component';
import { CCREditContainer } from './ccr-edit-container/ccr-edit.container';
import { CCREditMaterialComponent } from './ccr-edit-material/ccr-edit-material.component';
import { CCRMaterialLinesComponent } from './ccr-material-lines/ccr-material-lines.component';

@NgModule({
  imports: [
    CommonModule,
    FlordersModule,
    CCRRoutingModule,
    AngularMaterialModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule,
  ],
  declarations: [
    CCREditDeliveryComponent,
    CCREditDetailComponent,
    CCREditPlanningComponent,
    CCREditMaterialComponent,
    CCRMaterialLinesComponent,
    CCREditContainer,
  ],
  entryComponents: [ModalComponent],
})
export class CCRModule { }
