import {Component, EventEmitter, Input, Output} from '@angular/core';
import {EpsUser, EpsUsers} from '../../../../core/store/admin/users/users.interface';
import {UserListComponent} from '../../abstract-user/user-list/user-list.component';
import {util} from '../../../../core/util/util';

@Component({
  selector: 'admin-eps-user-list',
  templateUrl: './eps-user-list.component.html',
  styleUrls: ['./eps-user-list.component.less'],
})
export class EpsUserListComponent extends UserListComponent {
  @Input() isLoading: boolean;
  @Input() pageNr: number;
  @Input() pageSize: number;
  @Input() sortAscending: boolean;
  @Input() sortField: string;
  @Input() totalItems: number;
  @Input() users: EpsUsers; // naming convention: observables always end with $

  @Output() openUser: EventEmitter<EpsUser> = new EventEmitter();

  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() sortChange:EventEmitter<{sortField: string, sortAscending: boolean}> = new EventEmitter();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  sort(field: string) {
    util.sortHelper({ sortChange: this.sortChange, filter: this }, field);
  }

  sortBnd = this.sort.bind(this);

  onPageChange(pageNr): void {
    this.pageChange.emit(pageNr);
  }
}
