import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app.settings';
import { AbstractSandbox } from 'app/core/sandboxes/abstract.sandbox';
import { ContractDetailsRestService } from 'app/core/services/rest/contract-details.rest.service';
import * as actions from 'app/core/store/customer-info/customer-info.actions';
import 'rxjs/add/operator/delay';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AzureMonitoringService } from '../services/AzureMonitoringService';
import * as fromRoot from '../store';

@Injectable()
export class CustomerInfoSandbox extends AbstractSandbox {

  constructor(
    store: Store<fromRoot.RootState>,
    translateService: TranslateService,
    azureMonitoringService: AzureMonitoringService,
    private contractDetailsRestService: ContractDetailsRestService,
    private router: Router,
  ) {
    super(store, translateService, azureMonitoringService);
  }

  resetCustomerInfo(): void {
    this.store.dispatch(new actions.CustomerInfoResetAction());
  }

  loadCustomerInfo(): Observable<void> {
    const subject = new Subject<void>();

    // First make sure that definitions are loaded !!! (needed for Definitions of orderTYpes
    // definitions are fetched by the definitions guard

    // Then start loading customerInfo
    this.store.filter(state => state.definitions.loaded).take(1).subscribe((state) => {
      const customerId = state.session.activeCustomer.id;

      this.store.dispatch(new actions.CustomerInfoLoadAction(customerId));
      if (customerId) {

        this.contractDetailsRestService.getCustomerInfo(customerId).subscribe(
          (customerInfo) => {
            this.store.dispatch(new actions.CustomerInfoLoadSuccessAction({
              customerInfo,
              isAdmin: state.session.userContext.isAdmin,
              isAgent: state.session.userContext.isAgent,
              isEpsUser: state.session.userContext.isEpsUser,
              canRelocate: state.session.userContext.canRelocate,
              useEmailActors: state.session.userContext.useEmailActors,
              isTransporter: state.session.userContext.isTransporter,
              definitions: state.definitions,
              adminRoles: state.session.userContext.adminRoles,

            }));

            if (this.router.url === '/' + AppSettings.SELECT_CUSTOMER_ROUTE) {
              this.store.dispatch(go(AppSettings.DEFAULT_ROUTE));
            }

            subject.next();
            subject.complete();
          },
          (error) => {
            this.store.dispatch(new actions.CustomerInfoLoadFailAction(error));
            this.handleFail(error, '');
            subject.error(error);
          });
      } else {
        this.store.dispatch(new actions.CustomerInfoLoadFailAction(null));
      }

    });
    return subject.asObservable();
  }
}
