import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CalendarCreateRelocationModalComponent} from 'app/modules/calendar/calendar-create-relocation-modal/calendar-create-relocation-modal.component';
import {OrdersCalendarPageContainer} from 'app/modules/calendar/calendar-page-container/orders-calendar-page.container';
import {RelocationsCalendarPageContainer} from 'app/modules/calendar/calendar-page-container/relocations-calendar-page.container';
import {MyDatePickerModule} from 'mydatepicker-selectweek';
import {DragulaModule} from 'ng2-dragula';
import {CoreModule} from '../../core/core.module';
import {AdalModule} from '../../core/services/adal/adal.module';
import {AngularMaterialModule, SharedModule} from '../../shared';

import {ModalComponent} from '../../shared/modal/modal.component';
import {CalendarCalendarComponent} from './calendar-calendar/calendar-calendar.component';
import {CalendarDayComponent} from './calendar-calendar/calendar-day.component';
import {CalendarOrderListComponent} from './calendar-calendar/calendar-order-list.component';
import {CalendarCreateOrderModalComponent} from './calendar-create-order-modal/calendar-create-order-modal.component';
import {CalendarDraggableTemplatesComponent} from './calendar-draggable-templates/calendar-draggable-templates.component';
import {CalendarFilterComponent} from './calendar-filter/calendar-filter.component';
import {CalendarRoutingModule} from './calendar-routing.module';
import {CalendarOrderTooltipContainer} from './calendar-calendar/calendar-order-tooltip.container';
import {OrdersModule} from '../orders/orders.module';
import {CalendarRelocationTooltipContainer} from './calendar-calendar/calendar-relocation-tooltip.container';
import {RelocationModule} from '../relocation/relocation.module';

@NgModule({
  imports: [
    CommonModule,
    CalendarRoutingModule,

    OrdersModule,
    RelocationModule,
    SharedModule,
    AngularMaterialModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule,
    MyDatePickerModule,
    NgbModule,
    DragulaModule,
  ],
  declarations: [
    OrdersCalendarPageContainer,
    RelocationsCalendarPageContainer,
    CalendarFilterComponent,
    CalendarDraggableTemplatesComponent,
    CalendarCalendarComponent,
    CalendarDayComponent,
    CalendarOrderListComponent,
    CalendarOrderTooltipContainer,
    CalendarRelocationTooltipContainer,
    CalendarCreateOrderModalComponent,
    CalendarCreateRelocationModalComponent,
  ],
  entryComponents: [ModalComponent, CalendarCreateOrderModalComponent, CalendarCreateRelocationModalComponent], // needed for the modal
})
export class CalendarModule {}
