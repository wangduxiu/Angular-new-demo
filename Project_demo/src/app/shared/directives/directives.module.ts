import { NgModule } from '@angular/core';
import { SortableHeaderDirective } from './sortable-header.component';
import { OneOrAllFilter } from './one-or-all-filter.pipe';
import { SafePipe } from './safe.pipe';
import { StringDatePipe } from './string-date.pipe';
import { ButtonClickOnEnterDirective } from './button-click-on-enter';
import { ClickOutsideDirective } from './click-outside';

@NgModule({
  imports: [],
  exports: [SortableHeaderDirective, OneOrAllFilter, SafePipe, StringDatePipe, ButtonClickOnEnterDirective, ClickOutsideDirective],
  declarations: [SortableHeaderDirective, OneOrAllFilter, SafePipe, StringDatePipe, ButtonClickOnEnterDirective, ClickOutsideDirective],
})
export class DirectivesModule {}
