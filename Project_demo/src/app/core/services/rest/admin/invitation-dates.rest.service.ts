import { Injectable } from '@angular/core';
import { RestService } from '../rest.service';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { ClientUser, EpsUser } from '../../../store/admin/users/users.interface';
import 'rxjs/add/operator/delay';

@Injectable()
export class InvitationDatesRestService {
  constructor(private restService: RestService, private translate: TranslateService) {
  }

  // GET /api/User/nextDelayedInvitationDate

  getClientUserInvitationDate(): Observable<String> {
    return this.getInvitationDate('ClientUser');
  }

  getEpsUserInvitationDate(): Observable<String> {
    return this.getInvitationDate('EpsUser');
  }

  saveClientUserInvitationDate(date: String): Observable<boolean> {
    return this.saveInvitationDate('ClientUser', date);
  }

  saveEpsUserInvitationDate(date: String): Observable<boolean> {
    return this.saveInvitationDate('EpsUser', date);
  }

  private getInvitationDate(userType: string) {
    return this.restService
      .getTextData(`/User/nextDelayedInvitationDate?userType=${userType}`)
      .map(response => {
        return response.text();
      });
  }

  private saveInvitationDate(userType: string, date: String) {
    return this.restService
      .post(`/User/nextDelayedInvitationDate?userType=${userType}&invitationDate=${date}`, null)
      .map(response => {
        return true;
      });
  }

}
