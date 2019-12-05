import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SimplePageScrollService} from 'ng2-simple-page-scroll';
import {AppSettings} from '../../../app.settings';
import {AuthorizationMatrix} from '../../../core/store/contract-details/contract-details.interface';
import {Definitions} from '../../../core/store/definitions/definitions.interface';
import {Florder} from '../../../core/store/florders/florder.interface';
import {FlordersFilter} from '../../../core/store/florders/florders-filter.interface';
import {util} from '../../../core/util/util';

@Component({
  selector: 'app-relocation-list',
  templateUrl: './relocation-list.component.html',
  styleUrls: ['../../florders/florder-list/florder-list.less']
})
export class RelocationListComponent implements OnInit {

  private initialized: boolean = false;

  dateFormat: string = AppSettings.DATE_FORMAT_ANGULAR;
  showAll: boolean = false;

  @Input() relocations: Florder[];
  @Input() readonly definitions: Definitions;
  @Input() isLoading: boolean;
  @Input() filter: FlordersFilter;
  @Input() totalItems: number;
  @Input() authorization: AuthorizationMatrix;

  @Output() openRelocation: EventEmitter<Florder> = new EventEmitter();
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() sortChange: EventEmitter<{sortField: string, sortAscending: boolean}> = new EventEmitter();
  @Output() copyRelocation:EventEmitter<Florder> = new EventEmitter();
  @Output() asTemplate:EventEmitter<Florder> = new EventEmitter();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  constructor(private simplePageScrollService: SimplePageScrollService) {
  }

  ngOnInit(): void {
    this.initialized = true;
  }

  onPageChange(pageNr) {
    this.pageChange.emit(pageNr);
    this.simplePageScrollService.scrollToElement('#top', 0);
  }

  sort(field: string) {
    util.sortHelper(this, field);
  }

  sortBnd = this.sort.bind(this);

  preventRouting(event) {
    event.stopPropagation();
  }

  openMenu(event) {
    event.stopPropagation();
  }
}
