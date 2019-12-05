import { AdalConfigService } from './adal-config.service';
import { AdalService } from './adal.service';
import { AuthenticationGuard } from './authenticated.guard';
import { NgModule } from '@angular/core';
import { AdalRoutingModule } from './adal-routing.module';
import { OAuthCallbackReducer } from './oauth-callback.reducer';
import { IframeDummyComponent } from './iframe-dummy.component';

@NgModule({
  imports: [AdalRoutingModule],
  declarations: [IframeDummyComponent],
  providers: [OAuthCallbackReducer, AdalService, AdalConfigService, AuthenticationGuard]
})
export class AdalModule {
}
