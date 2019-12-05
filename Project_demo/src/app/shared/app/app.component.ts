import {ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {AutoLogoutService} from 'app/core/services/adal/auto-logout.service';
import {logger} from 'app/core/util/logger';
import {AppSettings} from '../../app.settings';
import {ConfigService} from '../../core/config/config-service';
import {AdalService} from '../../core/services/adal/adal.service';
import {AzureMonitoringService} from '../../core/services/AzureMonitoringService';
import * as fromRoot from '../../core/store';
import {AdalLoginAction, AdalLogoutAction} from '../../core/store/adal/adal.actions';
import {Adal} from '../../core/store/adal/adal.interface';
import {GetConfigAction} from '../../core/store/config/config.actions';
import {ContractRestrictions} from '../../core/store/contract-details/contract-details.interface';
import {Definition} from '../../core/store/definitions/definition.interface';
import {ClearActiveCustomerAction} from '../../core/store/select-customer/select-customer.actions';
import {UserContextLoadAction} from '../../core/store/user-context/user-context.actions';
import {UserContext} from '../../core/store/user-context/user-context.interface';
import {BaseContainer} from '../../modules/base/BaseContainer';
import {NgcCookieConsentService} from 'ngx-cookieconsent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent extends BaseContainer implements OnInit  {

  firstName: string;
  initials: string;
  activeCustomer: Definition;
  contextLoading: boolean = false;
  authorized: boolean = undefined;
  contractInfoLoading: boolean = false;
  customerSummaryLoading: boolean = false;
  customerInfoLoaded: boolean = false;
  canSwitchCustomer: boolean = false;
  loading: boolean = false;
  path: string;
  contractRestrictions: ContractRestrictions;
  isEpsUser: boolean = false;
  autologoutDisabled: boolean = false;

  constructor(
    store: Store<fromRoot.RootState>,
    azureMonitoringService: AzureMonitoringService,
    translate: TranslateService,
    private adalService: AdalService,
    config: ConfigService,
    private autoLogService: AutoLogoutService,
    private cd: ChangeDetectorRef,
    ccService: NgcCookieConsentService,
    private route: ActivatedRoute,
  ) {
    super(store, azureMonitoringService);

    this.route.queryParams.filter(params => params.token).subscribe(() => {
      this.login();
    });
    // Set language
    const setLanguage = function (lang?: string) {
      const language = lang && lang.toLowerCase() || AppSettings.DEFAULT_LANGUAGE;
      translate.setDefaultLang(AppSettings.DEFAULT_LANGUAGE);
      translate.use(language);
    };
    setLanguage();

    store.dispatch(new GetConfigAction(config.getConfig()));

    if (adalService.isAuthenticated) {
      store.dispatch(new UserContextLoadAction());
    }

    store.map(state => state.customerInfo).distinctUntilChanged().takeWhile(() => !this.destroyed)
      .subscribe(customerInfo => {
        this.customerInfoLoaded = customerInfo && customerInfo.loaded;
        this.contractRestrictions = customerInfo && customerInfo.restrictions;
      });

    store.map(state => state.ui).distinctUntilChanged().subscribe(ui => {
      this.loading = ui.busy;
      logger.debug(`loading: ${this.loading}`);
      this.cd.markForCheck();
    });

    store.select('session').takeWhile(() => !this.destroyed)
      .subscribe((session: { userContext: UserContext, adal: Adal, activeCustomer: Definition }) => {
        const userContext = session.userContext;
        if (userContext) {
          setLanguage(userContext.language);
          this.firstName = userContext.firstName;
          this.initials = userContext.initials;
          this.contextLoading = userContext.contextLoading;
          this.activeCustomer = session.activeCustomer;
          this.authorized = session.userContext.authorized;
          this.isEpsUser = userContext.isEpsUser;
          this.canSwitchCustomer = this.isEpsUser || userContext.customers && userContext.customers.length > 1;
        }
      });

    store.select('router').takeWhile(() => !this.destroyed)
      .subscribe((router: { path: string }) => {
        this.path = router.path;
      });


    translate
      .get(['COOKIE.HEADER', 'COOKIE.MESSAGE', 'COOKIE.DISMISS', 'COOKIE.ALLOW', 'COOKIE.DENY', 'COOKIE.LINK', 'COOKIE.POLICY'])
      .subscribe(data => {
        ccService.getConfig().content = ccService.getConfig().content || {} ;
        // Override default messages with the translated ones
        ccService.getConfig().content.header = data['COOKIE.HEADER'];
        ccService.getConfig().content.message = data['COOKIE.MESSAGE'];
        ccService.getConfig().content.dismiss = data['COOKIE.DISMISS'];
        ccService.getConfig().content.allow = data['COOKIE.ALLOW'];
        ccService.getConfig().content.deny = data['COOKIE.DENY'];
        ccService.getConfig().content.link = data['COOKIE.LINK'];
        ccService.getConfig().autoOpen = true;

        ccService.destroy();//remove previous cookie bar (with default messages)
        ccService.init(ccService.getConfig()); // update config with translated messages
      });
  }

  login(): void {
    if (this.authorized === false) {
      this.store.dispatch(new AdalLogoutAction());
    }
    this.store.dispatch(new AdalLoginAction());
  }

  logout(): void {
    this.store.dispatch(new AdalLogoutAction());
  }

  selectCustomer(): void {
    this.store.dispatch(new ClearActiveCustomerAction());
  }

  openModule(path: string): void {
    this.store.dispatch(go([path]));
  }

  gotoDashboard(): void {
    this.store.dispatch(go(['/']));
  }

  ngOnInit() {
    this.setAutologout();
  }

  toggleAutologout() {
    localStorage.setItem("autologoutDisabled", this.autologoutDisabled ? "false" : "true");
    this.setAutologout();
  }

  private setAutologout() {
    try {
      this.autologoutDisabled = localStorage.getItem("autologoutDisabled") === 'true';
      if (this.autologoutDisabled) {
        this.autoLogService.disable();
      } else {
        this.autoLogService.enable();
      }
    } catch (e) {
      logger.error('Issue with localStorage.getItem()');
    }
  }
}
