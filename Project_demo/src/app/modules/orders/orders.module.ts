import {NgModule} from '@angular/core';

import {ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule, SharedModule} from '../../shared';
import {CoreModule} from '../../core/core.module';
import {AdalModule} from '../../core/services/adal/adal.module';

import {ModalComponent} from '../../shared/modal/modal.component';
import {OrderListComponent} from './order-list/order-list.component';
import {CommonModule} from '@angular/common';
import {FlordersModule} from '../florders/florders.module';
import {OrdersRoutingModule} from './orders-routing.module';
import {OrderFilterComponent} from './order-filter/order-filter.component';
import {OrderPageContainer} from './order-page-container/order-page.container';
import {OrderEditDeliveryComponent} from './order-edit-delivery/order-edit-delivery.component';
import {OrderEditDetailComponent} from './order-edit-detail/order-edit-detail.component';
import {OrderEditPlanningComponent} from './order-edit-planning/order-edit-planning.component';
import {OrderEditContainer} from './order-edit-container/order-edit.container';
import {OrderEditMaterialComponent} from './order-edit-material/order-edit-material.component';
import {OrderMaterialLinesComponent} from './order-material-lines/order-material-lines.component';
import {PoNumberAsyncValidator} from '../florders/florder-edit-delivery/po-number-async-validator';
import {OrderDocumentsComponent} from './order-documents/order-documents.component';
import {SelectEmailAddressesModalComponent} from '../../shared/modal/modal-select-email-addresses.component';
import {OrdersRecurrenceModalComponent} from './orders-recurrence-modal/orders-recurrence-modal.component';
import {OrderCcrMaterialLinesComponent} from './order-ccr-material-lines/order-ccr-material-lines.component';

@NgModule({
  imports: [
    CommonModule,
    FlordersModule,
    OrdersRoutingModule,
    AngularMaterialModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule
  ],
  exports: [
    OrderEditDeliveryComponent,
    OrderEditDetailComponent,
    OrderEditPlanningComponent,
    OrderDocumentsComponent,
  ],
  declarations: [
    OrderFilterComponent,
    OrderListComponent,
    OrderPageContainer,
    OrderEditDeliveryComponent,
    OrderEditDetailComponent,
    OrderEditPlanningComponent,
    OrderEditMaterialComponent,
    OrderMaterialLinesComponent,
    OrderCcrMaterialLinesComponent,
    OrderEditContainer,
    OrderDocumentsComponent,
    OrdersRecurrenceModalComponent,
  ],
  providers: [
    PoNumberAsyncValidator
  ],
  entryComponents: [ModalComponent, SelectEmailAddressesModalComponent, OrdersRecurrenceModalComponent] // needed for the modal
})
export class OrdersModule {
}
