import {NgModule} from '@angular/core';

import {ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule, SharedModule} from '../../shared';
import {CoreModule} from '../../core/core.module';
import {AdalModule} from '../../core/services/adal/adal.module';

import {ModalComponent} from '../../shared/modal/modal.component';
import {CommonModule} from '@angular/common';
import {FlordersModule} from '../florders/florders.module';
import {RelocationRoutingModule} from './relocation-routing.module';
import {RelocationEditContainer} from './relocation-edit-container/relocation-edit.container';
import {RelocationEditDeliveryComponent} from './relocation-edit-delivery/relocation-edit-delivery.component';
import {RelocationEditDetailComponent} from './relocation-edit-detail/relocation-edit-detail.component';
import {RelocationEditPlanningComponent} from './relocation-edit-planning/relocation-edit-planning.component';
import {RelocationEditMaterialComponent} from './relocation-edit-material/relocation-edit-material.component';
import {RelocationMaterialLinesComponent} from './relocation-material-lines/relocation-material-lines.component';
import {RelocationPageContainer} from './relocation-page-container/relocation-page.container';
import {RelocationFilterComponent} from './relocation-filter/relocation-filter.component';
import {RelocationListComponent} from './relocation-list/relocation-list.component';

@NgModule({
  imports: [
    CommonModule,
    FlordersModule,
    RelocationRoutingModule,
    AngularMaterialModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule
  ],
  exports: [
    RelocationEditDeliveryComponent,
    RelocationEditDetailComponent,
    RelocationEditPlanningComponent,
  ],
  declarations: [
    RelocationEditContainer,
    RelocationEditDeliveryComponent,
    RelocationEditDetailComponent,
    RelocationEditPlanningComponent,
    RelocationEditMaterialComponent,
    RelocationMaterialLinesComponent,
    RelocationPageContainer,
    RelocationFilterComponent,
    RelocationListComponent,
  ],
  providers: [],
  entryComponents: [ModalComponent] // needed for the modal
})
export class RelocationModule {
}
