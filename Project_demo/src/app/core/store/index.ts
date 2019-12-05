import { compose } from '@ngrx/core/compose';
import { routerReducer, RouterState } from '@ngrx/router-store';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { ContractInfo } from 'app/core/store/contract-info/contract-info.interface';
import { CustomerInfo } from 'app/core/store/customer-info/customer-info.interface';
import { UI } from 'app/core/store/ui/ui.interface';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../../environments/environment';
import { Invoices } from '../model/Invoice.interface';
import { Adal } from './adal/adal.interface';
import { reducer as adalReducer } from './adal/adal.reducer';
import { AdminDefinitions } from './admin/admin-definitions/admin-definitions.interface';
import { reducer as adminDefinitionsReducer } from './admin/admin-definitions/admin-definitions.reducer';
import { I18n } from './admin/i18n/i18n.interface';
import { reducer as i18nreducer } from './admin/i18n/i18n.reducer';
import { InvitationDates } from './admin/invitation-dates/invitation-dates.interface';
import { reducer as invitationDatesReducer } from './admin/invitation-dates/invitation-dates.reducer';
import { reducer as adminClientUsersReducer } from './admin/users/client-users.reducer';
import { reducer as adminEditUserReducer } from './admin/users/edit-user.reducer';
import { reducer as adminEpsUsersReducer } from './admin/users/eps-users.reducer';
import { reducer as userSyncWithADReducer } from './admin/users/sync-users.reducer';
import { ClientUsers, EditUser, EpsUsers, SyncWithAD } from './admin/users/users.interface';
import { BlankReceipt } from './blank-receipts/blank-receipts.interface';
import { reducer as blankReceiptsReducer } from './blank-receipts/blank-receipts.reducer';
import { CalendarFlorders } from './calendar/calendar.interface';
import { reducer as CalendarReducer } from './calendar/calendar.reducer';
import { reducer as ccrDetailReducer } from './ccr-detail/ccr-detail.reducer';
import { Config } from './config/config.interface';
import { reducer as configReducer } from './config/config.reducer';
import { ContractDetails } from './contract-details/contract-details.interface';
import { reducer as contractDetailsReducer } from './contract-details/contract-details.reducer';
import { reducer as contractInfoReducer } from './contract-info/contract-info.reducer';
import { reducer as customerInfoReducer } from './customer-info/customer-info.reducer';
import { Definitions } from './definitions/definitions.interface';
import { reducer as definitionsReducer } from './definitions/definitions.reducer';
import { EmailActors } from './email-actors/email-actors.interface';
import { reducer as emailActorsReducer } from './email-actors/email-actors.reducer';
import { Florders } from './florders/florders.interface';
import { EditFlowDetail } from './flow-detail/flow-detail.interface';
import { reducer as flowDetailReducer } from './flow-detail/flow-detail.reducer';
import { reducer as flowsReducer } from './flows/flows.reducer';
import { reducer as invoiceReducer } from './invoice/invoice.reducer';
/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { EditOrderDetail } from './order-detail/order-detail.interface';
import { reducer as orderDetailReducer } from './order-detail/order-detail.reducer';
import { reducer as ordersReducer } from './orders/orders.reducer';
import { EditRelocationDetail } from './relocation-detail/relocation-detail.interface';
import { reducer as relocationDetailReducer } from './relocation-detail/relocation-detail.reducer';
import { reducer as relocationsReducer } from './relocations/relocations.reducer';
import { reducer as selectCustomerReducer } from './select-customer/select-customer.reducer';
import { Service } from './service/service.interface';
import { reducer as serviceReducer } from './service/service.reducer';
import { Stock } from './stock/stock.interface';
import { reducer as stockReducer } from './stock/stock.reducer';
import { TemplateState } from './template/template.interface';
import { reducer as templateReducer } from './template/template.reducer';
import { reducer as fromUiReducer } from './ui/ui.reducer';
import { UserContext } from './user-context/user-context.interface';
import { reducer as userContextReducer } from './user-context/user-context.reducer';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface RootState {
  admin: {
    epsUsers: EpsUsers;
    clientUsers: ClientUsers;
    adminDefinitions: AdminDefinitions;
    edit: EditUser;
    sync: SyncWithAD;
    dates: InvitationDates;
  };
  invoice: Invoices;
  config: Config;
  editCCRDetail: EditOrderDetail;
  editOrderDetail: EditOrderDetail;
  editFlowDetail: EditFlowDetail;
  template: TemplateState;
  orders: Florders;
  flows: Florders;
  session: {
    userContext: UserContext,
    adal: Adal,
    activeCustomer: {id: string, name: string}
  };
  definitions: Definitions;
  contractDetails: ContractDetails;
  customerInfo: CustomerInfo;
  contractInfo: ContractInfo;
  router: RouterState;
  calendar: CalendarFlorders;
  stock: Stock;
  emailActors: EmailActors;
  blankReceipts: BlankReceipt;
  service: Service;
  i18n: I18n;
  relocations: Florders;
  editRelocationDetail: EditRelocationDetail;
  ui: UI;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  config: configReducer,
  admin: combineReducers({
    epsUsers: adminEpsUsersReducer,
    clientUsers: adminClientUsersReducer,
    adminDefinitions: adminDefinitionsReducer,
    edit: adminEditUserReducer,
    sync: userSyncWithADReducer,
    dates: invitationDatesReducer,
  }),
  invoice: invoiceReducer,
  editOrderDetail: orderDetailReducer,
  editFlowDetail: flowDetailReducer,
  editCCRDetail: ccrDetailReducer,
  editRelocationDetail: relocationDetailReducer,
  template: templateReducer,
  orders: ordersReducer,
  flows: flowsReducer,
  relocations: relocationsReducer,
  session: combineReducers({
    userContext: userContextReducer,
    adal: adalReducer,
    activeCustomer: selectCustomerReducer,
  }),
  definitions: definitionsReducer,
  contractDetails: contractDetailsReducer,
  customerInfo: customerInfoReducer,
  contractInfo: contractInfoReducer,
  router: routerReducer,
  calendar: CalendarReducer,
  stock: stockReducer,
  emailActors: emailActorsReducer,
  blankReceipts: blankReceiptsReducer,
  service: serviceReducer,
  i18n: i18nreducer,
  ui: fromUiReducer,

};

const developmentReducer: ActionReducer<RootState> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<RootState> = combineReducers(reducers);

export function reducer(state: any, action: any): RootState {
  if (state && environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}
