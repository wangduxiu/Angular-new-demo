import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Invoice, Invoices} from '../../../core/model/Invoice.interface';
import {util} from '../../../core/util/util';
import {AuthorizationMatrix} from '../../../core/store/contract-details/contract-details.interface';
import {Place} from '../../../core/store/florders/place.interface';
import {AppSettings} from '../../../app.settings';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.less'],
})
export class InvoicesListComponent implements OnInit {

  @Input() invoices: Invoices;
  @Input() authorization: AuthorizationMatrix;
  @Input() places: Place[];
  @Input() currency: string;
  @Output() openInvoice = new EventEmitter<Invoice>();
  @Output() downloadList = new EventEmitter<Invoice>();
  @Output() changePage = new EventEmitter<number>();
  @Output() sortChange:EventEmitter<{sortField: string, sortAscending: boolean}> = new EventEmitter();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  pageSize: number = AppSettings.PAGE_SIZE;

  constructor() { }

  ngOnInit() {
  }

  onPageChange(pageNr: number) {
    this.changePage.emit(pageNr);
  }

  sort(field: string) {
    util.sortHelper({ sortChange: this.sortChange, filter: util.deepCopy(this.invoices.filter) }, field);
  }

  getName(id: string) {
    const place = this.places && this.places.find(p => p.id === id);
    return place && place.name || id;
  }

  sortBnd = this.sort.bind(this);

}
