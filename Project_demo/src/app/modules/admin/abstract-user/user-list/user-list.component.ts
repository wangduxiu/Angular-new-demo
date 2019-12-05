import { EventEmitter, Input, Output } from '@angular/core';
import { AppSettings } from '../../../../app.settings';

export abstract class UserListComponent {

  dateFormat: string = AppSettings.DATE_FORMAT_ANGULAR;

  @Input()
  pageNr: number;

  @Input()
  pageSize: number;

  @Input()
  totalItems: number;

  @Input()
  sortField: string;
  @Output()
  sortFieldChange: EventEmitter<string> = new EventEmitter();

  @Input()
  sortAscending: boolean;

  @Output()
  pageChange: EventEmitter<number> = new EventEmitter();


  @Output()
  sortAscendingChange: EventEmitter<boolean> = new EventEmitter();

  sort(field: string) {
    if (this.sortField === field) {
      this.sortAscending = !this.sortAscending;
      this.sortAscendingChange.emit(this.sortAscending);
    } else {
      this.sortField = field;
      this.sortFieldChange.emit(field);
      if (!this.sortAscending) {
        this.sortAscending = true;
        this.sortAscendingChange.emit(true);
      }
    }
  }

  sortBnd = this.sort.bind(this);

}
