import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {logger} from 'app/core/util/logger';
import {ToastrService} from 'ngx-toastr';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import {RootState} from '../';
import {util} from '../../util/util';
import {ShowModalAction} from '../modal/modal.actions';
import { AdalLogoutAction } from '../adal/adal.actions';
import * as actions from './notification.actions';

@Injectable()
export class NotificationEffects {

  constructor(private store: Store<RootState>, private actions$: Actions, private toastrService: ToastrService, private translateService: TranslateService) {
  }

  @Effect({ dispatch: false }) showNotification$: Observable<Action>
    = this.actions$
          .ofType(actions.SHOW_NOTIFICATION)
          .switchMap(({ payload }) => {
            const notification = util.deepCopy(payload);
            if (notification.verbose && document.location.href.startsWith('http://localhost')) {
              logger.info('-------------------');
              logger.info('| VERBOSE LOGGING |');
              logger.info('-------------------');
              logger.info(`title: ${notification.title}`);
              logger.info(`message: ${notification.message}`);
              logger.info(`type: ${notification.type}`);
              try {
                logger.info(JSON.parse(notification.verbose));
              } catch (e) {
                logger.info(notification.verbose);
              }
              logger.info('-------------------');
            }
            const options = Object.assign({},{
              positionClass: 'toast-bottom-right',
              timeOut: 5000,
              tapToDismiss: true,
              closeButton: false
            }, notification.options); // tslint:disable-line align
            const message = notification.message || (notification.messageCode && this.translateService.instant(notification.messageCode, notification.translationParams));
            const title = notification.title || (notification.titleCode && this.translateService.instant(notification.titleCode, notification.translationParams));
            const subMessages = notification.subMessages;

            if (notification.modal) {
              switch (notification.type) {
                case 'error':
                  this
                  .store
                  .dispatch(new ShowModalAction({
                    title,
                    message,
                    subMessages,
                    type: 'error',
                    titleCode: 'ERROR',
                    redirectUrl: notification.redirectUrl,
                    buttonText: 'SHARED.BUTTONS.CLOSE',
                    disableClose: notification.disableClose || notification.showLogout,
                    showLogout: notification.showLogout,
                  }));
                  break;
                case 'info':
                  this
                    .store
                    .dispatch(new ShowModalAction({
                      message,
                      subMessages,
                      title,
                      type: 'info',
                      titleCode: 'INFO',
                      redirectUrl: notification.redirectUrl,
                      buttonText: 'SHARED.BUTTONS.CLOSE',
                      disableClose: notification.disableClose,
                    }));
                  break;
                case 'warning':
                  this.store.dispatch(new ShowModalAction({ 
                    message, 
                    subMessages,
                    title,
                    type: 'warning', 
                    titleCode: 'WARNING', 
                    redirectUrl: notification.redirectUrl, 
                    buttonText: 'SHARED.BUTTONS.CLOSE', 
                    disableClose: notification.disableClose || notification.showLogout,
                    showLogout: notification.showLogout,
                  }));
                  break;
                case 'success':
                  this.store.dispatch(new ShowModalAction({ type: 'success', title, titleCode: 'SUCCESS', message, redirectUrl: notification.redirectUrl, buttonText: 'SHARED.BUTTONS.CLOSE', disableClose: notification.disableClose }));
                  break;
                default:
                  this.toastrService.error(message, title, options);
              }
            } else {
              switch (notification.type) {
                case 'error':
                  Object.assign(options, { timeOut: 50000, extendedTimeOut: 50000, closeButton: true });
                  this.toastrService.error(message, title, options);
                  break;
                case 'warning':
                  this.toastrService.warning(message, title, options);
                  break;
                case 'info':
                  this.toastrService.info(message, title, options);
                  break;
                case 'success':
                  Object.assign(options, { timeOut: 2000 });
                  this.toastrService.success(message, title, options);
                  break;
                default:
                  this.toastrService.error(message, title, options);
              }
            }
            return Observable.of(notification);// returning null halts all new action reducing
          });
}
