import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/observable/of';
import { AzureMonitoringService } from '../services/AzureMonitoringService';
import * as fromRoot from '../store';
import { ShowNotificationAction } from '../store/notification/notification.actions';
import { ErrorMessage } from '../util/error.interface';
import { util } from '../util/util';

export abstract class AbstractSandbox {


  protected constructor(protected store: Store<fromRoot.RootState>, protected translateService: TranslateService, protected azureMonitoringService: AzureMonitoringService) {
  }

  protected handleFail(err: Error | ErrorMessage | {messageCode: string}, titleKey: string = ''): void {
    let errorMessage;
    if (err['error'] && err['subMessages']) {
      errorMessage = err as ErrorMessage;
    } else if (err['messageCode']) {
      errorMessage = {
        message: this.translateService.instant(err['messageCode'], err['translationParams']),
        subMessages: [],
      }
    } else {
      errorMessage = util.getErrorMessage(err as Error);
    }

    let disableClose = false;
    if (err['error'] && err['error']['status'] == 406) {
      disableClose = true;
      errorMessage = {
        message: this.translateService.instant('ERRORS.AUTHORIZATION.ANOTHER_SESSION_WITH_DIFFERENT_CUSTOMER_OPENED'),
        subMessages: [],
      }
    }
    // Customer 'RE.2000016' belonging to Sales Organisation 'NL10' is not available for user 'a71da0d2-883e-46a3-8871-923d55896381'.

    this.azureMonitoringService.logException(errorMessage.error);
    this.store.dispatch(new ShowNotificationAction({ type: 'error', message: errorMessage.message, subMessages: errorMessage.subMessages, verbose: errorMessage.object, title: titleKey && this.translateService.instant(titleKey) || '', options: { enableHtml: true }, modal:true, disableClose }));

  }
}
