import { Action } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { logger } from 'app/core/util/logger';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { ADAL_401_ERROR_MESSAGE } from '../services/adal/adal.service';
import { AzureMonitoringService } from '../services/AzureMonitoringService';
import { util } from '../util/util';
import { ShowNotificationAction } from './notification/notification.actions';

export abstract class AbstractEffects {


  protected constructor(protected translateService: TranslateService, protected azureMonitoringService: AzureMonitoringService) {
  }

  protected handleFail(err: any, titleKey: string, observables: Observable<Action>[]): Observable<Action> {
    let errorMessage = util.getErrorMessage(err);
    let disableClose = false; // (err.status === 401); had to disable it because for get contract details, we got a 401:
    // Customer 'RE.2000016' belonging to Sales Organisation 'NL10' is not available for user 'a71da0d2-883e-46a3-8871-923d55896381'.

    if (err.stack) {
      logger.error(err.stack);
    }

    if (err.status == 406) {
      disableClose = true;
      errorMessage = {
        message: this.translateService.instant('ERRORS.AUTHORIZATION.ANOTHER_SESSION_WITH_DIFFERENT_CUSTOMER_OPENED'),
        subMessages: [],
        error: err
      }
    }

    let errorType: 'success' | 'error' | 'warning' | 'info' = 'error';
    if (errorMessage.message === ADAL_401_ERROR_MESSAGE) {
      errorType = 'warning';
    } else if (err.Level) {
      errorType = err.Level.toLowerCase();
    } else if (errorMessage && errorMessage.object && errorMessage.object.Level) {
      errorType = errorMessage.object.Level.toLowerCase();
    }

    this.azureMonitoringService.logException(errorMessage.error);
    const notificationActionObservable = Observable.of(new ShowNotificationAction({
      disableClose,
      type: errorType,
      message: errorMessage.message,
      showLogout: err.status === 401,
      subMessages: errorMessage.subMessages,
      messageCode: err.messageCode,
      translationParams: err.translationParams,
      verbose: errorMessage.object,
      title: this.translateService.instant(titleKey),
      options: {
        enableHtml: true,
      },
      modal: true,
    }));

    return Observable.concat(
      ...observables,
      notificationActionObservable,
    );
  }
}
