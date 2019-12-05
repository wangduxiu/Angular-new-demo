import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app.routing.module';
import { AppContainer } from '@app/app/app.container';
import { RouterService } from '@app/core/services/router.service';
import { HomeModule } from '@app/modules/home/home.module';
import { LoginModule } from '@app/modules/login/login.module';

@NgModule({
  declarations: [AppContainer],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    HomeModule,
    LoginModule
  ],
  providers: [RouterService],
  bootstrap: [AppContainer]
})
export class AppModule {}
