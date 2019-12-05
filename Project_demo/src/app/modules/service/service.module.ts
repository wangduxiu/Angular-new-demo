import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from 'app/core/core.module';
import { AngularMaterialModule, SharedModule } from '../../shared';
import { AdalModule } from '../../core/services/adal/adal.module';
import { ServiceRoutingModule } from './service-routing.module';

import { ServiceBoxesContainer } from './shared/service-boxes-container/service-boxes.container';
import { ServiceBoxComponent } from './shared/service-box/service-box.component';

import { EmailActorsPageContainer } from './email-actors/email-actors-page-container/email-actors-page.container';
import { EmailActorsListComponent } from './email-actors/email-actors-list/email-actors-list.component';

import { ContactPageContainer } from './contact/contact-page-container/contact-page.container';
import { ContactFormComponent } from './contact/contact-form/contact-form.component';

import { FAQPageContainer } from './faq/faq-page-container/faq-page.container';

@NgModule({
  imports: [
    CommonModule,
    ServiceRoutingModule,
    AngularMaterialModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
    AdalModule,
  ],
  declarations: [
    ServiceBoxesContainer,
    ServiceBoxComponent,
    EmailActorsPageContainer,
    EmailActorsListComponent,
    ContactPageContainer,
    ContactFormComponent,
    FAQPageContainer,
  ],
})
export class ServiceModule { }
