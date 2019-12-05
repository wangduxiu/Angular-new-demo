import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OrderDocument } from '../../../core/store/florder-detail/florder-detail.interface';

@Component({
  selector: 'app-order-documents',
  templateUrl: './order-documents.component.html',
  styleUrls: ['./order-documents.component.less'],
})
export class OrderDocumentsComponent {

  @Input() documents: any;
  @Output() downloadDocument = new EventEmitter();

  constructor() {

  }

  download(document: OrderDocument) {
    this.downloadDocument.emit({ documentId: document.documentId, extension: document.extension })
  }
}
