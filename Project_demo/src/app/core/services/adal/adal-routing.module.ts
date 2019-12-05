import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OAuthCallbackReducer } from './oauth-callback.reducer';
import { IframeDummyComponent } from './iframe-dummy.component';

const routes: Routes = [
  { path: 'id_token',     component: IframeDummyComponent, canActivate: [OAuthCallbackReducer] }, // Route for log in.  Fetches id_token
  { path: 'access_token', component: IframeDummyComponent, canActivate: [OAuthCallbackReducer] }, // Route for rest call (renew token, new token).  Fetches acces_token
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdalRoutingModule {
}
