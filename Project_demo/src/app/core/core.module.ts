import {NgModule} from '@angular/core';
import {Http} from '@angular/http';
import {EffectsModule} from '@ngrx/effects';
import {RouterStoreModule} from '@ngrx/router-store';
import {StoreModule} from '@ngrx/store';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AdminDefinitionsGuard} from 'app/core/guards/admin-definitions.guard';
import {CalendarClearStateUnguard} from 'app/core/guards/calendar-clear-state.unguard';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {FlowFilterValuesLoadGuard} from 'app/core/guards/flow-filter-values-load.guard';
import {OrderFilterValuesLoadGuard} from 'app/core/guards/order-filter-values-load.guard';
import {UserContextLoadGuard} from 'app/core/guards/user-context-load.guard';
import {CustomerInfoSandbox} from 'app/core/sandboxes/customer-info.sandbox';
import {FlowSandbox} from 'app/core/sandboxes/flow.sandbox';
import {FlowsSandbox} from 'app/core/sandboxes/flows.sandbox';

import {InvoiceSandbox} from 'app/core/sandboxes/invoice.sandbox';
import {OrderSandbox} from 'app/core/sandboxes/order.sandbox';
import {OrdersSandbox} from 'app/core/sandboxes/orders.sandbox';
import {RelocationSandbox} from 'app/core/sandboxes/relocation.sandbox';
import {TutorialSandbox} from 'app/core/sandboxes/tutorial.sandbox';
import {AutoLogoutService} from 'app/core/services/adal/auto-logout.service';
import {ContractInfoService} from 'app/core/services/contract-info.service';
import {RecurrenceService} from 'app/core/services/recurrence.service';
import {ContractInfoRestService} from 'app/core/services/rest/contract-info.rest.service';
import {FilterValuesRestService} from 'app/core/services/rest/filter-values.rest.service';
import {I18nEffects} from 'app/core/store/admin/i18n/i18n.effects';
import {CustomerInfoEffects} from 'app/core/store/customer-info/customer-info.effects';
import {CreateRelocationFromTemplateGuard} from 'app/core/store/relocation-detail/relocation-detail-create-from-template.resolve';
import {EditOrderTemplateGuard} from 'app/core/store/template/order-template-edit.resolve';
import {GetOrderTemplatesGuard} from 'app/core/store/template/order-templates.resolve';
import {EditRelocationTemplateGuard} from 'app/core/store/template/relocation-template-edit.resolve';
import {GetRelocationTemplatesGuard} from 'app/core/store/template/relocation-templates.resolve';
import {CookieModule} from 'ngx-cookie';
import {Observable} from 'rxjs/Observable';
import {AppSettings} from '../app.settings';
import {ConfigServiceModule} from './config/config.module';
import {ClearInvoicesFilterGuard} from './guards/invoices-clear.guard';
import {ActiveCustomerService} from './services/active-customer.service';
import {AdminDefinitionRestService} from './services/rest/admin/admin-definition.rest.service';
import {InvitationDatesRestService} from './services/rest/admin/invitation-dates.rest.service';
import {UserRestService} from './services/rest/admin/user.rest.service';
import {BlankReceiptRestService} from './services/rest/blank-receipt.rest.service';
import {CCRRestService} from './services/rest/ccr.rest.service';
import {ContactRestService} from './services/rest/contact.rest.service';
import {ContractDetailsRestService} from './services/rest/contract-details.rest.service';
import {CustomersRestService} from './services/rest/customers.rest.service';
import {DefinitionRestService} from './services/rest/definition.rest.service';
import {DocumentRestService} from './services/rest/document.rest.service';
import {EmailActorsRestService} from './services/rest/email-actors.rest.service';
import {FlowRestService} from './services/rest/flow.rest.service';
import {I18nRestService} from './services/rest/i18n.rest.service';
import {InvoicesRestService} from './services/rest/invoices.rest.service';
import {OrderRestService} from './services/rest/order.rest.service';
import {RelocationRestService} from './services/rest/relocation.rest.service';
import {RestService} from './services/rest/rest.service';
import {StockRestService} from './services/rest/stock.rest.service';
import {TemplateRestService} from './services/rest/template.rest.service';
import {TutorialRestService} from './services/rest/tutorial.rest.service';
import {UserContextRestService} from './services/rest/user-context.rest.service';
import {TranslationHelperService} from './services/translate-helper.service';
import {ValidatorService} from './services/validator.service';

import {reducer} from './store';
import {AdalEffects} from './store/adal/adal.effects';
import {AdminDefinitionsEffects} from './store/admin/admin-definitions/admin-definitions.effects';
import {GetAdminDefinitionsGuard} from './store/admin/admin-definitions/admin-definitions.resolve';
import {ResetI18nGuard} from './store/admin/i18n/i18n.resolve';
import {InvitationDatesEffects} from './store/admin/invitation-dates/invitation-dates.effects';
import {GetInvitationDatesGuard} from './store/admin/invitation-dates/invitation-dates.resolve';
import {CreateClientUserGuard, GetClientUserGuard, InviteClientUserGuard} from './store/admin/users/client-user.resolve';
import {CreateEpsUserGuard, GetEpsUserGuard, InviteEpsUserGuard} from './store/admin/users/eps-user.resolve';
import {UsersEffects} from './store/admin/users/users.effects';
import {AzureLogEffects} from './store/azure-log/azure-log.effects';
import {BlankReceiptsEffects} from './store/blank-receipts/blank-receipts.effects';
import {CalendarEffects} from './store/calendar/calendar.effects';
import {CCRDetailEffects} from './store/ccr-detail/ccr-detail.effects';
import {GetCCRGuard} from './store/ccr-detail/ccr-detail.resolve';
import {ConfigEffects} from './store/config/config.effects';
import {CustomerSummaryEffects} from './store/customer-summary/customer-summary.effects';
import {DefinitionsEffects} from './store/definitions/definitions.effects';
import {GetDefinitionsGuard} from './store/definitions/definitions.resolve';
import {EmailActorsEffects} from './store/email-actors/email-actors.effects';
import {GetEmailActorsGuard} from './store/email-actors/email-actors.resolve';
import {CreateFlowGuard} from './store/flow-detail/flow-detail-create.resolve';
import {EditFlowGuard} from './store/flow-detail/flow-detail-edit.resolve';
import {FlowDetailEffects} from './store/flow-detail/flow-detail.effects';
import {GetFlowGuard} from './store/flow-detail/flow-detail.resolve';
import {ClearFlowsFilterGuard} from './store/flows/flows-clear.resolve';
import {FlowsOpenHandshakesFilterGuard} from './store/flows/flows-open-handshakes.resolve';
import {RefreshFlowsFilterGuard} from './store/flows/flows-refresh.resolve';
import {FlowsEffects} from './store/flows/flows.effects';
import {DescartesInvoicesEffects} from './store/invoice/descartes-invoices.effects';
import {GetDescartesInvoicesUrlGuard} from './store/invoice/descartes-invoices.resolve';
import {ModalEffects} from './store/modal/modal.effects';
import {NotificationEffects} from './store/notification/notification.effects';
import {CreateOrderFromTemplateGuard} from './store/order-detail/order-detail-create-from-template.resolve';
import {CreateOrderGuard} from './store/order-detail/order-detail-create.resolve';
import {OrderDetailEffects} from './store/order-detail/order-detail.effects';
import {GetOrderGuard} from './store/order-detail/order-detail.resolve';
import {ClearOrdersFilterGuard} from './store/orders/orders-clear.resolve';
import {RefreshOrdersFilterGuard} from './store/orders/orders-refresh.resolve';
import {OrdersEffects} from './store/orders/orders.effects';
import {CreateRelocationGuard} from './store/relocation-detail/relocation-detail-create.resolve';
import {RelocationDetailEffects} from './store/relocation-detail/relocation-detail.effects';
import {GetRelocationGuard} from './store/relocation-detail/relocation-detail.resolve';
import {RefreshRelocationsFilterGuard} from './store/relocations/relocations-refresh.resolve';
import {RelocationsEffects} from './store/relocations/relocations.effects';
import {AuthorizationGuard} from './store/select-customer/authorization.resolve';
import {ClearCustomerGuard} from './store/select-customer/select-customer-clear.resolve';
import {NotSelectedCustomerGuard} from './store/select-customer/select-customer-not-selected.resolve';
import {SelectCustomerEffects} from './store/select-customer/select-customer.effects';
import {ContactEffects} from './store/service/contact/contact.effects';
import {OpenPdfEffect} from './store/shared/open-pdf-effect';
import {GetPowerBIUrlGuard} from './store/stock/power-bi.resolve';
import {StockEffects} from './store/stock/stock.effects';
import {TemplateEffects} from './store/template/template.effects';
import {UserContextEffects} from './store/user-context/user-context.effects';
import {FilterValuesService} from './services/filter-values.service';
import {SelectedCustomerGuard} from './store/select-customer/select-customer-selected.resolve';
import {DependencyTreeGuard} from './guards/dependency-tree.guard';
import {CustomerInfoLoadIfSelectedGuard} from './guards/customer-info-load-if-selected.guard';

export function createTranslateLoader(http: Http) {
  const dbTranslateLoader = new TranslateHttpLoader(http, './api/Translation/get?id=', '');
  const assetsTranslateLoader = new TranslateHttpLoader(http, './assets/locale/', '.json');
  const translateLoader: TranslateLoader = {
    getTranslation(lang: string): Observable<any> {
      if (lang === AppSettings.DEFAULT_LANGUAGE) {
        return assetsTranslateLoader.getTranslation(AppSettings.DEFAULT_LANGUAGE);
      } else {
        return dbTranslateLoader.getTranslation(lang);
      }
    }
  }
  return translateLoader;
}

@NgModule({
  imports: [

    CookieModule.forRoot(),
    /**
     * StoreModule.provideStore is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.provideStore(reducer),
    RouterStoreModule.connectRouter(),
    EffectsModule.run(DefinitionsEffects),
    EffectsModule.run(OrdersEffects),
    EffectsModule.run(FlowsEffects),
    EffectsModule.run(TemplateEffects),
    EffectsModule.run(OrderDetailEffects),
    EffectsModule.run(FlowDetailEffects),
    EffectsModule.run(CCRDetailEffects),
    EffectsModule.run(UserContextEffects),
    EffectsModule.run(AdalEffects),
    EffectsModule.run(NotificationEffects),
    EffectsModule.run(CustomerInfoEffects),
    EffectsModule.run(AzureLogEffects),
    EffectsModule.run(AdminDefinitionsEffects),
    EffectsModule.run(UsersEffects),
    EffectsModule.run(ModalEffects),
    EffectsModule.run(SelectCustomerEffects),
    EffectsModule.run(CalendarEffects),
    EffectsModule.run(StockEffects),
    EffectsModule.run(EmailActorsEffects),
    EffectsModule.run(BlankReceiptsEffects),
    EffectsModule.run(ContactEffects),
    EffectsModule.run(DescartesInvoicesEffects),
    EffectsModule.run(I18nEffects),
    EffectsModule.run(RelocationsEffects),
    EffectsModule.run(RelocationDetailEffects),
    EffectsModule.run(OpenPdfEffect),
    EffectsModule.run(CustomerSummaryEffects),
    EffectsModule.run(InvitationDatesEffects),
    EffectsModule.run(ConfigEffects),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http],
      },
    }),

  ],
  exports: [TranslateModule, ConfigServiceModule],
  declarations: [],
  providers: [
    RestService,
    OrderRestService,
    FlowRestService,
    TemplateRestService,
    DefinitionRestService,
    ContractDetailsRestService,
    UserContextRestService,
    CustomersRestService,
    UserRestService,
    AdminDefinitionRestService,
    CCRRestService,
    InvoicesRestService,
    StockRestService,
    EmailActorsRestService,
    BlankReceiptRestService,
    ContactRestService,
    DocumentRestService,
    I18nRestService,
    RelocationRestService,
    AutoLogoutService,
    TutorialRestService,
    InvitationDatesRestService,
    ContractInfoRestService,
    FilterValuesRestService,

    ValidatorService,
    TranslationHelperService,
    ActiveCustomerService,
    RecurrenceService,
    ContractInfoService,
    FilterValuesService,

    SelectedCustomerGuard,
    AuthorizationGuard,
    GetOrderGuard,
    CreateOrderGuard,
    CreateOrderFromTemplateGuard,
    CreateRelocationFromTemplateGuard,
    CreateFlowGuard,
    GetFlowGuard,
    GetEpsUserGuard,
    GetClientUserGuard,
    InviteClientUserGuard,
    CreateClientUserGuard,
    InviteEpsUserGuard,
    CreateEpsUserGuard,
    CustomerInfoLoadGuard,
    CustomerInfoLoadIfSelectedGuard,
    ClearOrdersFilterGuard,
    ClearFlowsFilterGuard,
    RefreshFlowsFilterGuard,
    RefreshOrdersFilterGuard,
    FlowsOpenHandshakesFilterGuard,
    GetDefinitionsGuard,
    GetCCRGuard,
    GetAdminDefinitionsGuard,
    AdminDefinitionsGuard,
    ClearCustomerGuard,
    NotSelectedCustomerGuard,
    GetOrderTemplatesGuard,
    GetRelocationTemplatesGuard,
    GetEmailActorsGuard,
    ClearInvoicesFilterGuard,
    GetDescartesInvoicesUrlGuard,
    ResetI18nGuard,
    EditFlowGuard,
    CreateRelocationGuard,
    EditOrderTemplateGuard,
    EditRelocationTemplateGuard,
    GetPowerBIUrlGuard,
    GetRelocationGuard,
    RefreshRelocationsFilterGuard,
    GetInvitationDatesGuard,
    FlowFilterValuesLoadGuard,
    OrderFilterValuesLoadGuard,
    UserContextLoadGuard,
    DependencyTreeGuard,

    CalendarClearStateUnguard,

    InvoiceSandbox,
    FlowSandbox,
    FlowsSandbox,
    TutorialSandbox,
    RelocationSandbox,
    OrderSandbox,
    OrdersSandbox,
    CustomerInfoSandbox,
  ],
})

export class CoreModule {
  constructor() {
  }
}
