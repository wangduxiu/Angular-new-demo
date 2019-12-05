import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AppSettings} from '../../../../app.settings';
import {ClientUser, ClientUsers} from '../../../../core/store/admin/users/users.interface';
import {UserListComponent} from '../../abstract-user/user-list/user-list.component';
import {util} from '../../../../core/util/util';
import {fadeInAnimation} from '../../../../animations';

@Component({
  selector: 'admin-client-user-list',
  templateUrl: './client-user-list.component.html',
  styleUrls: ['./client-user-list.component.less'],
  animations: [fadeInAnimation],
})
export class ClientUserListComponent extends UserListComponent {

  dateFormat: string = AppSettings.DATE_FORMAT_ANGULAR;

  @Input() isLoading: boolean;
  @Input() pageNr: number;
  @Input() pageSize: number;
  @Input() sortAscending: boolean;
  @Input() sortField: string;
  @Input() totalItems: number;
  @Input() users: ClientUsers;// naming convention: observables always end with $

  @Output() openUser: EventEmitter<ClientUser> = new EventEmitter();

  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() sortChange:EventEmitter<{sortField: string, sortAscending: boolean}> = new EventEmitter();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  sort(field: string) {
    util.sortHelper({ sortChange: this.sortChange, filter: this }, field);
  }

  sortBnd = this.sort.bind(this);
}
