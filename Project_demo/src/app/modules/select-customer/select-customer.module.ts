import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, AngularMaterialModule } from '../../shared';
import { SelectCustomerContainer } from './select-customer-container/select-customer-container';
import { SelectCustomerRoutingModule } from './select-customer-routing.module';
import { CoreModule } from '../../core/core.module';
import { TilePageComponent } from './tile-page/tile-page.component';
import { TileSearch } from './tile-search/tile-search.component';
import { TileComponent } from './tile/tile.component';
import { TileListComponent } from './tile-list/tile-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SelectCustomerRoutingModule,
    AngularMaterialModule,
    CoreModule,
  ],
  declarations: [
    TileComponent,
    TileListComponent,
    TilePageComponent,
    TileSearch,
    SelectCustomerContainer,
  ],
})
export class SelectCustomerModule {}
