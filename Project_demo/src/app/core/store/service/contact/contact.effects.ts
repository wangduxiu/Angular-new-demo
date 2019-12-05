import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { go } from '@ngrx/router-store';

import * as actions from '../service.actions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import { RootState } from '../..';
import { ContactRestService } from '../../../services/rest/contact.rest.service';
import { AbstractEffects } from '../../AbstractEffects';
import { TranslateService } from '@ngx-translate/core';
import { AdalService } from '../../../services/adal/adal.service';
import { AzureMonitoringService } from '../../../services/AzureMonitoringService';
import { ShowNotificationAction } from '../../../store/notification/notification.actions';

@Injectable()
export class ContactEffects extends AbstractEffects {

  constructor(private store: Store<RootState>, azureMonitoringService: AzureMonitoringService, private actions$: Actions, private contactRestService: ContactRestService, translateService: TranslateService, private adalService: AdalService) {
    super(translateService, azureMonitoringService);
  }

  @Effect()
  sendContactMessage$: Observable<Action> = this.actions$
    .ofType(actions.CONTACT_SEND_MESSAGE)
    .switchMap(action => // Register to this event, unregister previous if new event occurs.
      this.contactRestService.sendContactMessage(action.payload.message)   // Send contact message
        .switchMap(response =>
          Observable.from([new ShowNotificationAction({
            type: 'success', messageCode: 'SERVICE.CONTACT.SEND_SUCCESS', modal: true, disableClose: false
          }), new actions.ContactSendMessageSuccessAction()])
        )
        .catch((err) => this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
          Observable.of(new actions.ContactSendMessageFailAction(err)),
        ])
        )
    );
}
