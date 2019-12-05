import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared';
import { InvoicesFilterComponent } from './invoices-filter/invoices-filter.component';
// custom slider component
import { InvoicesListComponent } from './invoices-list/invoices-list.component';
import { InvoicesPageContainer } from './invoices-page-container/invoices-page-container.component';

import { InvoicesRoutingModule } from './invoices-routing.module';

@NgModule({
  imports: [
    CommonModule,
    InvoicesRoutingModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
  ],
  declarations: [
    InvoicesPageContainer,
    InvoicesFilterComponent,
    InvoicesListComponent,
  ],
})
export class InvoicesModule { }
