import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ContactMessage } from '../../store/service/contact/contact.interface';
import { RestService } from './rest.service';

@Injectable()
export class ContactRestService {
  constructor(private restService: RestService) {
  }

  sendContactMessage(contactMessage): Observable<ContactMessage> {
    const postData = this.createPostData(contactMessage);
    return this.restService.post<ContactMessage>('/Contact/sendMessage', postData);
  }

  protected createPostData(message): ContactMessage {
    return {
      subject: message.subject.name,
      comments: message.comments,
      soldTo: message.subject.id == 3 ? message.soldToName : undefined,
      shipTo: message.subject.id == 4 ? message.shipToName: undefined,
      vat: message.subject.id == 3 ? message.vat : undefined,
      address: message.subject.id == 3 || message.subject.id == 4 ? message.address : undefined,
      postalCode: message.subject.id == 3 || message.subject.id == 4 ? message.postalCode : undefined,
      city: message.subject.id == 3 || message.subject.id == 4 ? message.city : undefined,
      country: message.subject.id == 3 || message.subject.id == 4 ? message.country : undefined,
      salesOrder: message.subject.id == 7 ? message.salesOrder : undefined,
    };
  }
}
