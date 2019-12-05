import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { TutorialSandbox } from 'app/core/sandboxes/tutorial.sandbox';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import { AuthorizationMatrix } from '../../../core/store/contract-details/contract-details.interface';
import * as summaryCustomerActions from '../../../core/store/customer-summary/customer-summary.actions';
import { CustomerSummary } from '../../../core/store/customer-summary/customer-summary.interface';
import { Place } from '../../../core/store/florders/place.interface';
import * as flowsActions from '../../../core/store/flows/flows.actions';
import * as ordersActions from '../../../core/store/orders/orders.actions';
import * as userContextActions from '../../../core/store/user-context/user-context.actions';
import { UserContext } from '../../../core/store/user-context/user-context.interface';
import { util } from '../../../core/util/util';
import { BaseContainer } from '../../base/BaseContainer';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard.container.html',
  styleUrls: ['./dashboard.container.less'],
  animations: [
    trigger('tile', [
      transition(':enter', [
        query('.tile', [
          style({ opacity: 0, transform: 'translateY(-50px)' }),
          stagger(50, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
          ])
        ])
      ])
    ])
  ]

})
export class DashboardContainer extends BaseContainer implements OnInit, OnDestroy {
  customerSummary: CustomerSummary;
  authorization: AuthorizationMatrix;
  depots: Place[] = [];
  showTutorialPopup: boolean = util.isDesktop();

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService, private tutorialSandbox: TutorialSandbox) {
    super(store, azureMonitoringService);
  }

  ngOnInit(): void {
    this.store.dispatch(new flowsActions.DasboardTileLatestFlowsLoad());
    this.store.dispatch(new ordersActions.DasboardTileLatestOrdersLoad());
    this.store.dispatch(new summaryCustomerActions.CustomerStockLoadAction());

    this.store
      .takeWhile(() => !this.destroyed)
      .subscribe((state) => {
        this.authorization = state.customerInfo.authorization;
        this.customerSummary = state.contractDetails.customerSummary;
        this.depots = Object.keys(state.customerInfo.places).map(key => state.customerInfo.places[key]).filter((place: Place) => place.isDepot);
      });

    this.store.select('session').takeWhile(() => !this.destroyed)
      .subscribe((session: { userContext: UserContext }) => {
        const userContext = session.userContext;
        if (userContext) {
          this.showTutorialPopup = this.showTutorialPopup && userContext.showTutorial;
        }
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new summaryCustomerActions.CustomerSummarySetOutdatedAction());
  }

  viewFlow({ etmOrderNumber, salesOrderNumber }) {
    this.store.dispatch(go([`flows/${etmOrderNumber}`, { salesOrderNumber, back: 'dashboard' }]));
  }

  viewOrder({ etmOrderNumber, salesOrderNumber }) {
    this.store.dispatch(go([`orders/${etmOrderNumber}`, { salesOrderNumber, back: 'dashboard' }]));
  }

  queryOrders() {
    this.store.dispatch(new ordersActions.OrdersClearAction());
    this.store.dispatch(go([`orders/refresh`]));
  }

  queryFlows() {
    this.store.dispatch(new flowsActions.FlowsClearAction());
    this.store.dispatch(go([`flows/refresh`]));
  }

  queryOpenHandshakes() {
    this.store.dispatch(go([`flows/openHandshakes`]));
  }

  gotoOrderCalendar() {
    this.store.dispatch(go([`calendar/order`]));
  }

  gotoTemplates() {
    this.store.dispatch(go([`orders/template/new`]));
  }

  goToTutorials = () => {
    this.tutorialSandbox.goToTutorials();
  }

  hideTutorial = (forEver: boolean) => {
    if(forEver) {
      this.tutorialSandbox.hideTutorial().subscribe((response) => {
        if(response.status === 200){
          this.store.dispatch(new userContextActions.UserContextUpdateTutorialAction());
        }
      });
    } else {
      this.store.dispatch(new userContextActions.UserContextUpdateTutorialAction());
    }

  }

  countTiles(): number {
    let count = 0;
    if (this.authorization.ORDER.QUERY) count += 1;           // check calendar
    if (this.authorization.ORDER.CREATE_TEMPLATE) count += 1; // Create template
    if (this.customerSummary.latestOrders) count += 1;        // Latest orders
    if (this.depots.length) count += 1;                       // depot
    if (this.customerSummary.latestFlows.length || this.customerSummary.openHandshakes.openHandshakeTotal) count += 1;      // List flows / Open handshakes
    if (this.customerSummary.stockOverview) count += 1;       // Stock overview
    return count;
  }
}
