import {Component} from '@angular/core';
import {go} from '@ngrx/router-store';
import {Store} from '@ngrx/store';
import {AuthorizationMatrix} from 'app/core/store/contract-details/contract-details.interface';
import {fadeInAnimation} from '../../../../animations';
import {AzureMonitoringService} from '../../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../../core/store';
import {EpsUsersLoadAction} from '../../../../core/store/admin/users/users.actions';
import {EpsUser, EpsUsers} from '../../../../core/store/admin/users/users.interface';
import {UserPageContainer} from '../../abstract-user/user-page-container/user-page.container';

@Component({
  selector: 'admin-eps-user-page',
  templateUrl: './eps-user-page.container.html',
  styleUrls: ['../../abstract-user/user-page-container/user-page.container.less'],
  animations: [fadeInAnimation],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpsUserPageContainer extends UserPageContainer {
  users: EpsUsers;
  sortField: string;
  sortAscending: boolean;
  authorization: AuthorizationMatrix;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService) {
    super(store, azureMonitoringService);
    store.select('admin')
      .takeWhile(() => !this.destroyed)
      .map((admin: { epsUsers: EpsUsers }) => admin && admin.epsUsers)
      .subscribe(users => {
        this.users = users;
        this.pageNr = users.pageNr;
        this.sortField = users.sortField;
        this.sortAscending = users.sortAscending;
      });
  }

  protected reload(): void {
    this.store.dispatch(new EpsUsersLoadAction({ adminDefinitions: this.adminDefinitions, filter: this.filter, pageSize: this.pageSize, pageNr: this.pageNr, sortField: this.sortField, sortAscending: this.sortAscending  }));
  }

  openEpsUser(epsUser: EpsUser): void {
    if(this.authorization.adminRoles.updateEpsUser) {
      this.store.dispatch(go([`/admin/epsUsers/${epsUser.id}/edit`]));
    } else {
      this.store.dispatch(go([`/admin/epsUsers/${epsUser.id}`]));
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

  inviteNewEpsUser() {
    this.store.dispatch(go([`/admin/epsUsers/invite`]));
  }

  // createNewEpsUser(): void {
  //   this.store.dispatch(go([`/admin/epsUsers/create`]));
  // }

}
