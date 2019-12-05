import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule, SharedModule } from '../../shared';
import { CoreModule } from '../../core/core.module';
import { AdalModule } from '../../core/services/adal/adal.module';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';

import { ReportPageContainer } from './report-page-container/report-page.container';

import { StockPageComponent } from './stock-page/stock-page.component';
import { StockFilterComponent } from './stock-filter/stock-filter.component';
import { StockListComponent } from './stock-list/stock-list.component';

import { PowerBIComponent } from './power-bi/power-bi.component';

@NgModule({
  imports: [
    CommonModule,
    ReportRoutingModule,
    AngularMaterialModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule,
  ],
  declarations: [
    ReportPageContainer,
    StockPageComponent,
    StockFilterComponent,
    StockListComponent,
    PowerBIComponent,
  ],
  entryComponents: [],
})
export class ReportModule { }
