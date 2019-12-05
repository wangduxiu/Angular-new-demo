import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { LoginContainer } from '@app/modules/login/login.container';
import { HomeRoutingModule } from '@app/modules/home/home-routing.module';

@NgModule({
  imports: [SharedModule, HomeRoutingModule],
  exports: [],
  declarations: [LoginContainer],
  providers: []
})
export class LoginModule {}
