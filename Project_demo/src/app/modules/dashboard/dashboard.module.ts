import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { AdalModule } from '../../core/services/adal/adal.module';
import { AngularMaterialModule, SharedModule } from '../../shared';
import { DashboardContainer } from './dashboard-container/dashboard.container';
import { DashboardTile } from './dashboard-tile/dashboard-tile';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { OpenHandshakesTile } from './dashboard-tile/tile-open-handshakes';
import { LatestOrdersTile } from './dashboard-tile/tile-latest-orders/tile-latest-orders';
import { DepotTile } from './dashboard-tile/tile-depot';
import { FeatureTile } from './dashboard-tile/feature-tile';
import { OpenHandshakesSummaryTile } from './dashboard-tile/tile-open-handshakes-summary';
import { StockSummaryTile } from './dashboard-tile/tile-stock-summary/tile-stock-summary';
import { LatestFlowsTile } from './dashboard-tile/tile-latest-flows/tile-latest-flows';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule,
    DashboardRoutingModule,
  ],
  declarations: [
    DashboardContainer,
    DashboardTile,
    OpenHandshakesTile,
    OpenHandshakesSummaryTile,
    LatestFlowsTile,
    LatestOrdersTile,
    DepotTile,
    FeatureTile,
    StockSummaryTile,
  ]
})
export class DashboardModule { }
