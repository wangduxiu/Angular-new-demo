import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { HomeContainer } from '@app/modules/home/home.container';
import { HomeRoutingModule } from '@app/modules/home/home-routing.module';

@NgModule({
  imports: [SharedModule, HomeRoutingModule],
  exports: [],
  declarations: [HomeContainer],
  providers: []
})
export class HomeModule {}
