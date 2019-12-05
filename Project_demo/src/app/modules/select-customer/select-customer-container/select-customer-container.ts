import {Component, EventEmitter, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {fadeInAnimation} from '../../../animations';
import {ActiveCustomerService} from '../../../core/services/active-customer.service';
import {AzureMonitoringService} from '../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import {Adal} from '../../../core/store/adal/adal.interface';
import {SetActiveCustomerAction} from '../../../core/store/select-customer/select-customer.actions';
import {CustomersClearAction, CustomersLoadAction} from '../../../core/store/user-context/user-context.actions';
import {SalesOrganisation, UserContext} from '../../../core/store/user-context/user-context.interface';
import {util} from '../../../core/util/util';
import {BaseContainer} from '../../base/BaseContainer';
import {Tile, TilesGroupedByLetter} from '../tile/tile.interface';

const EPS_USER_SALES_ORG_TAB = 0;
const EPS_USER_CUSTOMER_TAB = 1;

@Component({
  selector: 'app-select-customer-container',
  templateUrl: './select-customer-container.html',
  styleUrls: ['./select-customer-container.less'],
  animations: [fadeInAnimation],
})
export class SelectCustomerContainer extends BaseContainer implements OnInit {

  customersGroupedByLetter: TilesGroupedByLetter[];
  salesOrganisationsGroupedByLetter: TilesGroupedByLetter[];
  salesOrgs: SalesOrganisation[];
  isEpsUser: boolean = false;
  // tabs
  selectedTab: number = 0;
  customersTabDisabled: boolean = true;
  customersLoading = false;
  customerInfoLoading = false;
  selectedSalesOrganisation: Tile = null;
  selectedCustomerId: string = null;
  clearFilter = new EventEmitter<boolean>();

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, private activeCustomerService: ActiveCustomerService) {
    super(store, azureMonitoringService);
  }

  ngOnInit() {
    // get customer list and/or SalesOrgs
    // subscribe to store 'session'
    this.customersGroupedByLetter = [];
    this.salesOrganisationsGroupedByLetter = [];
    this.salesOrgs = [];

    this.store
      .select('session')
      .takeWhile(() => !this.destroyed)
      .map((session: { userContext: UserContext }) => session.userContext && session.userContext.customersLoading)
      .distinctUntilChanged()
      .subscribe(customersLoading => {
        this.customersLoading = customersLoading
      });
    this.store
      .select('session')
      .takeWhile(() => !this.destroyed)
      .map((session: { userContext: UserContext; adal: Adal }) => session.userContext && session.userContext.salesOrganisations)
      .distinctUntilChanged()
      .subscribe(salesOrganisations => {
        if (salesOrganisations) {
          // EPS user, tab 1
          this.isEpsUser = true;
          this.salesOrgs = salesOrganisations;
          this.salesOrganisationsGroupedByLetter = this.groupByLetter(util.deepCopy(salesOrganisations));

          if (salesOrganisations.length === 1) {
            this.handleSalesOrganisationClicked(salesOrganisations[0]);
          }

        } else {
          this.salesOrganisationsGroupedByLetter = [];
        }
      });

    this.store
      .select('session')
      .takeWhile(() => !this.destroyed)
      .map((session: { userContext: UserContext; adal: Adal }) => session.userContext && session.userContext.customers)
      .distinctUntilChanged()
      .subscribe(customers => {
        // Client user & eps user tab 2
        if (customers) {
          // select sales organisation
          if (customers.length) {
            this.selectedSalesOrganisation = this.salesOrgs.find(so => so.id === customers[0].salesOrganization);
          }
          if (customers.length === 1) {
            this.handleCustomerClicked(customers[0]);
          }
          this.customersGroupedByLetter = this.groupByLetter(customers.map(c => {
            return { ...util.deepCopy(c), number: c.id };
          }));
          if (this.isEpsUser) {
            // move 1 tab
            this.customersTabDisabled = false;
            this.selectedTab = EPS_USER_CUSTOMER_TAB;
          }
        } else {
          this.disableCustomersTab();
        }
      });

    this.store
      .takeWhile(() => !this.destroyed)
      .map(state => state.ui)
      .distinctUntilChanged()
      .subscribe(ui => {
        this.customerInfoLoading = ui.busy;
      })

  }

  groupByLetter(list): TilesGroupedByLetter[] {
    // sort first
    list.sort((a, b) => {
      const nameASplit = a.name.split('] ')[1];
      const nameBSplit = b.name.split('] ')[1];
      const nameA = nameASplit && nameASplit.length && nameASplit.length === 2 ? nameASplit[1] : a.name;
      const nameB = nameBSplit && nameBSplit.length && nameBSplit.length === 2 ? nameBSplit[1] : b.name;

      return nameA.localeCompare(nameB);
    });

    return list.reduce((res, c) => {
      const nameSplit = c.name.split('] ');
      const name = nameSplit && nameSplit.length && nameSplit.length === 2 ? nameSplit[1] : c.name;
      const firstChar = name[0].toLocaleUpperCase();
      let entry = res.find(e => e.firstLetter === firstChar);
      if (!entry) {
        entry = {firstLetter: firstChar, tiles: []};
        res.push(entry);
      }
      entry.tiles.push(c);
      return res;
    }, []);
  }

  handleSalesOrganisationClicked(salesOrganisation) {
    if (salesOrganisation) {
      // request customers
      this.selectedSalesOrganisation = salesOrganisation;
      this.customersGroupedByLetter = [];
      this.store.dispatch(new CustomersLoadAction(salesOrganisation.id));
    }
  }

  handleCustomerClicked(customer) {
    this.selectedCustomerId = customer.id;
    this.store.dispatch(new SetActiveCustomerAction(customer));
  }

  tabChanged(tab) {
    this.clearFilter.emit(true);
    // if first tab selected again, reset settings
    if (tab.index === EPS_USER_SALES_ORG_TAB) {
      this.selectedSalesOrganisation = null;
      this.store.dispatch(new CustomersClearAction());
    }
  }

  disableCustomersTab() {
    this.selectedTab = EPS_USER_SALES_ORG_TAB;
    this.customersTabDisabled = true;
    window.setTimeout(() => this.customersGroupedByLetter = null, this.isEpsUser ? 1000 : 0);// If EPS user => wait a second so that tab change is finished

  }
}
