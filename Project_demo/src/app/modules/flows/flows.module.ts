import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { FlowsRoutingModule } from './flows-routing.module';
import { AngularMaterialModule, SharedModule } from '../../shared';
import { CoreModule } from '../../core/core.module';
import { AdalModule } from '../../core/services/adal/adal.module';

import { CommonModule } from '@angular/common';
import { FlowListComponent } from './flow-list/flow-list.component';
import { FlowEditDeliveryComponent } from './flow-edit-delivery/flow-edit-delivery.component';
import { FlordersModule } from '../florders/florders.module';
import { FlowPageContainer } from './flow-page-container/flow-page.container';
import { FlowEditContainer } from './flow-edit-container/flow-edit.container';
import { FlowFilterComponent } from './flow-filter/flow-filter.component';
import { FlowEditDetailComponent } from './flow-edit-detail/flow-edit-detail.component';
import { FlowEditPlanningComponent } from './flow-edit-planning/flow-edit-planning.component';
import { FlowEditMaterialComponent } from './flow-edit-material/flow-edit-material.component';
import { FlowMaterialLinesComponent } from './flow-material-lines/flow-material-lines.component';
import { FlowDateAsyncValidator } from './flow-edit-planning/flow-date-async-validator';
import { PoNumberAsyncValidator } from '../florders/florder-edit-delivery/po-number-async-validator';

@NgModule({
  imports: [
    CommonModule,
    FlordersModule,
    FlowsRoutingModule,
    AngularMaterialModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule,
  ],
  declarations: [
    FlowPageContainer,
    FlowEditContainer,
    FlowFilterComponent,
    FlowListComponent,
    FlowEditDeliveryComponent,
    FlowEditDetailComponent,
    FlowEditPlanningComponent,
    FlowEditMaterialComponent,
    FlowMaterialLinesComponent,
  ],
  providers: [
    FlowDateAsyncValidator,
    PoNumberAsyncValidator,
  ]
})
export class FlowsModule { }
