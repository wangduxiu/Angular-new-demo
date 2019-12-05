import {Store} from '@ngrx/store';
import {BaseContainer} from '../../base/BaseContainer';
import {AzureMonitoringService} from '../../../core/services/AzureMonitoringService';
import * as fromRoot from '../../../core/store';
import {Definitions} from '../../../core/store/definitions/definitions.interface';
import {FlordersFilter} from '../../../core/store/florders/florders-filter.interface';
import {util} from '../../../core/util/util';
import {Definition} from '../../../core/store/definitions/definition.interface';

export abstract class FlorderPageContainer extends BaseContainer {
  definitions: Definitions;
  filter: FlordersFilter;
  totalItems: number;
  filterExcecutionTimestamp: Date;
  flordersAreLoading: boolean = false;
  isDownloading: boolean = false;
  shipTos: Definition[];

  constructor(store: Store<fromRoot.RootState>, azureMonitoringService: AzureMonitoringService) {
    super(store, azureMonitoringService);
    store.select('definitions').takeWhile(() => !this.destroyed).subscribe((definitions: Definitions) => this.definitions = definitions);
  }

  filterFlorders({ value, valid }: { value: FlordersFilter; valid: boolean }) {
    if (valid) {
      this.filterExcecutionTimestamp = new Date();
      this.filter = util.deepCopy(value);
      this.filter.pageNr = 1;
      this.reload();
    }
  }

  onPageChange(pageNr): void {
    this.filter.pageNr = pageNr;
    this.reload();
  }

  onItemsPerPageChange(itemsPerPage: number) {
    this.filter.pageSize = itemsPerPage;
    this.reload();
  }

  protected abstract reload();

  protected abstract createFlorder();

  sortChange({ sortField, sortAscending }) {
    this.filter.sortField = sortField;
    this.filter.sortAscending = sortAscending;
    this.reload();
  }
}
