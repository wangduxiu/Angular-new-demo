import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarClearStateUnguard} from 'app/core/guards/calendar-clear-state.unguard';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import {GetOrderTemplatesGuard} from 'app/core/store/template/order-templates.resolve';
import {GetRelocationTemplatesGuard} from 'app/core/store/template/relocation-templates.resolve';
import {OrdersCalendarPageContainer} from 'app/modules/calendar/calendar-page-container/orders-calendar-page.container';
import {RelocationsCalendarPageContainer} from 'app/modules/calendar/calendar-page-container/relocations-calendar-page.container';
import 'rxjs/add/operator/distinctUntilChanged';
import {AdalModule} from '../../core/services/adal/adal.module';

const routes: Routes = [
  {
    path: 'calendar/order',
    component: OrdersCalendarPageContainer,
    canActivate: [DependencyTreeGuard],
    canDeactivate: [CalendarClearStateUnguard],
    data: {
      guards: [GetOrderTemplatesGuard],
      type: 'ORDER'
    },
  },
  {
    path: 'calendar/relocation',
    component: RelocationsCalendarPageContainer,
    canActivate: [DependencyTreeGuard],
    canDeactivate: [CalendarClearStateUnguard],
    data: {
      guards: [GetRelocationTemplatesGuard],
      type: 'RELOCATION'
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), AdalModule],
  exports: [RouterModule],
})
export class CalendarRoutingModule {
}
