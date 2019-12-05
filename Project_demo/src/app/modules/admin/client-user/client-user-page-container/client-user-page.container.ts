import {Component} from '@angular/core';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {fadeInAnimation} from '../../../../animations';
import {AzureMonitoringService} from '../../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../../core/store';
import {ClientUsersLoadAction} from '../../../../core/store/admin/users/users.actions';
import {ClientUser, ClientUsers} from '../../../../core/store/admin/users/users.interface';
import {UserPageContainer} from '../../abstract-user/user-page-container/user-page.container';

@Component({
  selector: 'admin-client-user-page',
  templateUrl: './client-user-page.container.html',
  styleUrls: ['../../abstract-user/user-page-container/user-page.container.less'],
  animations: [fadeInAnimation],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientUserPageContainer extends UserPageContainer {
  users: ClientUsers;
  sortField: string;
  sortAscending: boolean;
  isAgent: boolean = false;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService) {
    super(store, azureMonitoringService);
    store
      .select('admin')
      .takeWhile(() => !this.destroyed)
      .map((admin: {clientUsers: ClientUsers}) => admin && admin.clientUsers)
      .subscribe(users => {
        this.users = users;
        this.pageNr = users.pageNr;
        this.sortField = users.sortField;
        this.sortAscending = users.sortAscending;
      });
    store.take(1).subscribe(root => this.isAgent = root.session.userContext.isAgent);

  }

  protected reload(): void {
    this.store.dispatch(new ClientUsersLoadAction({ adminDefinitions: this.adminDefinitions, filter: this.filter, pageSize: this.pageSize, pageNr: this.pageNr, sortField: this.sortField, sortAscending: this.sortAscending }));
  }

  inviteNewClientUser(): void {
    this.store.dispatch(go([`/admin/clientUsers/invite`]));
  }

  createNewClientUser(): void {
    this.store.dispatch(go([`/admin/clientUsers/create`]));
  }

  bulkInviteOrCreate(): void {
    this.store.dispatch(go([`/admin/clientUsers/bulkInviteCreate`]));
  }

  openClientUser(clientUser: ClientUser): void {
    if(this.authorization.adminRoles.updateClientUser) {
      this.store.dispatch(go([`/admin/clientUsers/${clientUser.id}/edit`]));
    } else {
      this.store.dispatch(go([`/admin/clientUsers/${clientUser.id}`]));
    }
  }

  onPageChange(pageNr): void {
    this.pageNr = pageNr;
    this.reload();
  }

  sortChange({ sortField, sortAscending }) {
    this.sortField = sortField;
    this.sortAscending = sortAscending;
    this.reload();
  }
}
