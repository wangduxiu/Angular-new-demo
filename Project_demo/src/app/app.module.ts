import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {CoreModule} from './core/core.module';
import {AppComponent} from './shared/app/app.component';
// routing
import {AppRoutingModule} from './app-routing.module';
// modules
import {SharedModule} from './shared';
// gesture support angularMaterial
import 'hammerjs';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {Ng2SimplePageScrollModule} from 'ng2-simple-page-scroll';
import {ToastrModule} from 'ngx-toastr';
import {AdminModule} from './modules/admin/admin.module';
import {AdminRoutingModule} from './modules/admin/admin-routing.module';
import {OrdersModule} from './modules/orders/orders.module';
import {FlowsModule} from './modules/flows/flows.module';
import {CCRModule} from './modules/ccr/ccr.module';
import {SelectCustomerModule} from './modules/select-customer/select-customer.module';
import {AzureMonitoringService} from './core/services/AzureMonitoringService';
import {InvoicesModule} from 'app/modules/invoices/invoices.module';
import {DashboardModule} from './modules/dashboard/dashboard.module';
import {CalendarModule} from './modules/calendar/calendar.module';
import {ReportModule} from './modules/report/report.module';
import {BlankReceiptModule} from './modules/blank-receipt/blank-receipt.module';
import {ServiceModule} from './modules/service/service.module';
import {DescartesInvoicesModule} from 'app/modules/descartes-invoices/descartes-invoices.module';
import {RelocationModule} from 'app/modules/relocation/relocation.module';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConfigServiceModule} from './core/config/config.module';
import {TutorialsModule} from './modules/tutorials/tutorials.module';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';

const cookieConfig: NgcCookieConsentConfig = {
  position: 'bottom-right',
  theme: 'classic',
  container: document.getElementById('content'),
  palette: {
    popup: {
      background: '#CBE4EF',
      text: '#004868'
    },
    button: {
      background: '#04ACF7',
      text: '#ffffff'
    }
  },
  revokable: false,
  autoOpen: false,
  cookie: {
    domain: undefined, // 'europoolsystem.com' // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    ConfigServiceModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    AdminRoutingModule,
    CoreModule,
    OrdersModule,
    FlowsModule,
    CCRModule,
    AdminModule,
    CoreModule,
    SharedModule,
    DashboardModule,
    StoreDevtoolsModule.instrumentOnlyWithExtension({maxAge: 5}),
    Ng2SimplePageScrollModule.forRoot(),
    ToastrModule.forRoot(),
    SelectCustomerModule,
    InvoicesModule,
    SelectCustomerModule,
    CalendarModule,
    ReportModule,
    ServiceModule,
    BlankReceiptModule,
    DescartesInvoicesModule,
    NgbModule.forRoot(),
    RelocationModule,
    TutorialsModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
  ],
  providers: [AzureMonitoringService],
  bootstrap: [AppComponent]
})
export class AppModule {}
