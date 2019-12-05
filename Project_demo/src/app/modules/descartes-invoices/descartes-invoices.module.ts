import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'app/core/core.module';
import { SharedModule } from 'app/shared';
import { DescartesInvoicesPageContainer } from './descartes-invoices-page-container/descartes-invoices-page-container.component';
import { DescartesInvoicesRoutingModule } from './descartes-invoices-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DescartesInvoicesRoutingModule,
    SharedModule,
    CoreModule,
    ReactiveFormsModule,
  ],
  declarations: [
    DescartesInvoicesPageContainer,
  ],
})
export class DescartesInvoicesModule { }
