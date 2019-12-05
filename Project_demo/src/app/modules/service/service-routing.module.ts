import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomerInfoLoadGuard} from 'app/core/guards/customer-info-load.guard';
import {DependencyTreeGuard} from 'app/core/guards/dependency-tree.guard';
import {GetDefinitionsGuard} from 'app/core/store/definitions/definitions.resolve';
import 'rxjs/add/operator/distinctUntilChanged';
import {AdalModule} from '../../core/services/adal/adal.module';
import {GetEmailActorsGuard} from '../../core/store/email-actors/email-actors.resolve';
import {ContactPageContainer} from './contact/contact-page-container/contact-page.container';
import {EmailActorsPageContainer} from './email-actors/email-actors-page-container/email-actors-page.container';
import {FAQPageContainer} from './faq/faq-page-container/faq-page.container';
import {AuthorizationGuard} from '../../core/store/select-customer/authorization.resolve';

const routes: Routes = [
  {
    path: 'email-actors',
    component: EmailActorsPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [GetEmailActorsGuard, GetDefinitionsGuard, CustomerInfoLoadGuard, AuthorizationGuard],
      authorization: 'useEmailActors'
    },
  },
  {
    path: 'faq',
    component: FAQPageContainer,
    canActivate: [DependencyTreeGuard],
    data: {
      guards: [GetDefinitionsGuard],
    },
  },
  {
    path: 'contact',
    component: ContactPageContainer,
    canActivate: []
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes), AdalModule],
  exports: [RouterModule],
})
export class ServiceRoutingModule {
}
