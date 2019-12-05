import {Store} from '@ngrx/store';
import {BaseContainer} from '../../../base/BaseContainer';
import * as fromRoot from '../../../../core/store';
import {AdminDefinitions} from '../../../../core/store/admin/admin-definitions/admin-definitions.interface';
import {UsersFilter} from '../../../../core/store/admin/users/users-filter.interface';
import {UsersSyncWithAD} from '../../../../core/store/admin/users/users.actions';
import {SyncWithAD} from '../../../../core/store/admin/users/users.interface';
import {util} from '../../../../core/util/util';
import {AzureMonitoringService} from '../../../../core/services/AzureMonitoringService';
import {AppSettings} from '../../../../app.settings';

export abstract class UserPageContainer extends BaseContainer {
  sync: SyncWithAD;

  adminDefinitions: AdminDefinitions;
  protected filter: UsersFilter;
  pageNr: number;
  pageSize: number = AppSettings.ADMIN_PAGE_SIZE;
  sortField: string;
  sortAscending: boolean;

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService) {
    super(store, azureMonitoringService);
    store.select('admin').takeWhile(() => !this.destroyed).map((admin: {adminDefinitions: AdminDefinitions}) => admin && admin.adminDefinitions).subscribe(adminDefinitions => this.adminDefinitions = adminDefinitions);
    store.select('admin').takeWhile(() => !this.destroyed).map((admin: {sync: SyncWithAD}) => admin && admin.sync).subscribe(sync => this.sync = sync);
  }

  filterUsers({ value, valid }: { value: UsersFilter; valid: boolean }) {
    if (valid) {
      this.filter = util.deepCopy(value);
      this.pageNr = 1;
      this.reload();
    }
  }

  onPageChange(pageNr): void {
    this.pageNr = pageNr;
    this.reload();
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.pageSize = itemsPerPage;
    this.reload();
  }

  protected abstract reload();

  sortFieldChange(sortField) {
    this.sortField = sortField;
    this.reload();
  }

  sortAscendingChange(sortAscending) {
    this.sortAscending = sortAscending;
    this.reload();
  }

  syncWithAD(): void {
    this.store.dispatch(new UsersSyncWithAD());
  }

}
