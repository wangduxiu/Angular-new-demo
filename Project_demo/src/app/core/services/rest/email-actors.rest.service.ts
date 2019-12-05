import { Injectable } from '@angular/core';
import { logger } from 'app/core/util/logger';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../app.settings';
import { EmailActorsItem } from '../../store/email-actors/email-actors.interface';
import { default as cachedEmailActors } from './responses/getEmailActors';
import { RestService } from './rest.service';

@Injectable()
export class EmailActorsRestService {
  constructor(private restService: RestService) {
  }

  getEmailActors(customerId): Observable<EmailActorsItem[]> {
    if (AppSettings.USE_MOCK_REST_DATA) {
      logger.log('MOCK REST getEmailActors');
      return Observable.of(cachedEmailActors);
    } else {
      return this.restService.get<EmailActorsItem[]>(`/EmailActor/get?customerId=${customerId}`);
    }
  }

  createEmailActors(emailActor:EmailActorsItem, customerId: string):Observable<EmailActorsItem> {
    const postData = this.createPostData(emailActor, customerId);
    return this.restService.post<any>('/EmailActor/createOrUpdate', postData)
    .map(res => JSON.parse(res._body));
  }

  deleteEmailActor(emailActorId:number): Observable<EmailActorsItem> {
    const postData = {
      id: emailActorId,
    };
    return this.restService.post<any>('/EmailActor/delete', postData)
    .map(res => JSON.parse(res._body));
  }

  protected createPostData(emailActor:EmailActorsItem, customerId: string) {
    const postData = {
      id: emailActor.id,
      name: emailActor.name,
      email: emailActor.email,
      isActive: emailActor.isActive,
      customerId: customerId,
    };
    return postData;
  }
}
