import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {AbstractEffects} from 'app/core/store/AbstractEffects';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import {Observable} from 'rxjs/Observable';
import {AzureMonitoringService} from '../../../services/AzureMonitoringService';
import {UserRestService} from '../../../services/rest/admin/user.rest.service';
import {CustomersRestService} from '../../../services/rest/customers.rest.service';
import {ShowModalAction} from '../../modal/modal.actions';
import {Modal} from '../../modal/modal.interface';
import {ShowNotificationAction} from '../../notification/notification.actions';
import * as actions from './users.actions';
import {ClientUser, EpsUser, PasswordResetResponse} from './users.interface';

@Injectable()
export class UsersEffects extends AbstractEffects {

  constructor(translateService: TranslateService, azureMonitoringService: AzureMonitoringService, private actions$: Actions, private userRestService: UserRestService, private customersRestService: CustomersRestService) {
    super(translateService, azureMonitoringService);
  }

  @Effect() syncUsersWithAD$: Observable<Action> = this.actions$
    .ofType(actions.USERS_SYNC_WITH_AD)
    .switchMap(action =>
      this.userRestService.syncWithAD()
        .switchMap(response => {
          return Observable.from([
            new actions.UsersSyncWithADSuccess(),
            new ShowNotificationAction({ type: 'success', messageCode: 'SHARED.SYNC_SUCCESS', modal: false, disableClose: false })
          ]);
        })
        .catch((err) => {
          return Observable.concat(Observable.of(new actions.UsersSyncWithADFail(err)), Observable.of(new ShowNotificationAction({
            type: 'error',
            message: 'Error syncing users with Active Directory',
            options: { enableHtml: true },
            modal: true,
            disableClose: false
          })));
        }));

  @Effect() loadEpsUser$: Observable<Action> = this.actions$
    .ofType(actions.EPS_USER_LOAD)
    .switchMap(action =>
      this.userRestService.getEpsUser(action.payload)
        .map(user => new actions.EpsUserLoadSuccessAction(user))
        .catch((err) => {
          return Observable.of(new actions.EpsUserLoadFailAction(err));
        }));

  @Effect() loadClientUser$: Observable<Action> = this.actions$
    .ofType(actions.CLIENT_USER_LOAD)
    .switchMap(action =>
      this.userRestService.getClientUser(action.payload)
        .map(user => new actions.ClientUserLoadSuccessAction(user))
        .catch((err) => {
          return Observable.of(new actions.ClientUserLoadFailAction(err));
        }));

  @Effect() loadEpsUsers$: Observable<Action> = this.actions$
    .ofType(actions.EPS_USERS_LOAD)
    .debounceTime(50)
    .switchMap(action =>
      this.userRestService.getEpsUsers(action.payload.filter, action.payload.pageSize, action.payload.pageNr, action.payload.sortField, action.payload.sortAscending)   // Request orders
        .map(response => new actions.EpsUsersLoadSuccessAction(Object.assign({}, response, {
          items: response.items as EpsUser[],
          adminDefinitions: action.payload.adminDefinitions,
          pageNr: action.payload.pageNr as number,
          pageSize: action.payload.pageSize as number,
          sortField: action.payload.sortField,
          sortAscending: action.payload.sortAscending
        })))
        .catch((err) => {
          return Observable.of(new actions.EpsUsersLoadFailAction(err));
        }));

  @Effect() loadClientUsers$: Observable<Action> = this.actions$
    .ofType(actions.CLIENT_USERS_LOAD)
    .debounceTime(50)
    .switchMap(action =>
      this.userRestService.getClientUsers(action.payload.filter, action.payload.pageSize, action.payload.pageNr, action.payload.sortField, action.payload.sortAscending)   // Request orders
        .map(response => new actions.ClientUsersLoadSuccessAction(Object.assign({}, response, {
          items: response.items as ClientUser[],
          adminDefinitions: action.payload.adminDefinitions,
          pageNr: action.payload.pageNr as number,
          pageSize: action.payload.pageSize as number,
          sortField: action.payload.sortField,
          sortAscending: action.payload.sortAscending
        })))
        .catch((err) => {
          return Observable.of(new actions.ClientUsersLoadFailAction(err));
        }));

  @Effect() updateEpsUser$: Observable<Action> = this.actions$
    .ofType(actions.EPS_USER_UPDATE)
    .switchMap(action =>
      this.userRestService.updateEpsUser(action.payload)
        .switchMap(response => {
          const modalData: Modal = {
            type: 'success',
            titleCode: 'SUCCESS',
            messageCode: 'ADMIN.SHARED.USER_UPDATE_SUCCESS',
            redirectUrl: '/admin/epsUsers',
            buttonText: 'SHARED.BUTTONS.GO_TO_OVERVIEW',
            disableClose: false,
          };
          return Observable.from([
            new ShowModalAction(modalData),
            new actions.EpsUserUpdateSuccessAction(response)
          ]);
        })
        .catch((err) => {
          return this.handleFail(err, 'ADMIN.SHARED.USER_UPDATE_FAIL', [
            Observable.of(new actions.EpsUserUpdateFailAction(err))
          ]);
        }));

  @Effect() updateClientUser$: Observable<Action> = this.actions$
    .ofType(actions.CLIENT_USER_UPDATE)
    .switchMap(action =>
      this.userRestService.updateClientUser(action.payload)
        .switchMap(response => {
          const modalData: Modal = {
            type: 'success',
            titleCode: 'SUCCESS',
            messageCode: 'ADMIN.SHARED.USER_UPDATE_SUCCESS',
            redirectUrl: '/admin/clientUsers',
            buttonText: 'SHARED.BUTTONS.GO_TO_OVERVIEW',
            disableClose: false,
          };
          return Observable.from([
            new ShowModalAction(modalData),
            new actions.ClientUserUpdateSuccessAction(response)
          ]);
        })
        .catch((err) => {
          return this.handleFail(err, 'ADMIN.SHARED.USER_UPDATE_FAIL', [
            Observable.of(new actions.ClientUserUpdateFailAction(err))
          ]);
        }));

  @Effect() inviteClientUser$: Observable<Action> = this.actions$
    .ofType(actions.CLIENT_USER_INVITE_UPDATE)
    .switchMap(action =>
      this.userRestService.inviteClientUser(action.payload)
        .switchMap(response => {
          const modalData: Modal = {
            type: 'success',
            titleCode: 'SUCCESS',
            messageCode: 'ADMIN.SHARED.USER_INVITE_SUCCESS',
            redirectUrl: '/admin/clientUsers',
            buttonText: 'SHARED.BUTTONS.GO_TO_OVERVIEW',
            disableClose: false,
          };
          return Observable.from([
            new ShowModalAction(modalData),
            new actions.ClientUserInviteSuccessAction(response)
          ]);
        })
        .catch((err) => {
          return this.handleFail(err, 'ADMIN.SHARED.USER_INVITE_FAIL', [
            Observable.of(new actions.ClientUserInviteFailAction(err))
          ]);
        }));

  @Effect() inviteEpsUser$: Observable<Action> = this.actions$
    .ofType(actions.EPS_USER_INVITE_UPDATE)
    .switchMap(action =>
      this.userRestService.inviteEpsUser(action.payload)
        .switchMap(response => {
          const modalData: Modal = {
            type: 'success',
            titleCode: 'SUCCESS',
            messageCode: 'ADMIN.SHARED.USER_INVITE_SUCCESS',
            redirectUrl: '/admin/epsUsers',
            buttonText: 'SHARED.BUTTONS.GO_TO_OVERVIEW',
            disableClose: false,
          };
          return Observable.from([
            new ShowModalAction(modalData),
            new actions.EpsUserInviteSuccessAction(response)
          ]);
        })
        .catch((err) => {
          return this.handleFail(err, 'ADMIN.SHARED.USER_INVITE_FAIL', [
            Observable.of(new actions.EpsUserInviteFailAction(err))
          ]);

        }));

  @Effect() createClientUser$: Observable<Action> = this.actions$
    .ofType(actions.CLIENT_USER_CREATE)
    .switchMap(action =>
      this.userRestService.createClientUser(action.payload)
        .switchMap((response: any) => {
          const modalData: Modal = {
            type: 'success',
            titleCode: 'SUCCESS',
            messageCode: 'ADMIN.SHARED.USER_CREATE_SUCCESS',
            redirectUrl: '/admin/clientUsers',
            buttonText: 'SHARED.BUTTONS.GO_TO_OVERVIEW',
            disableClose: false,
            params: response,
            copyToClipboard: `${response.mail} ${response.password}`,
          };
          return Observable.from([
            new ShowModalAction(modalData),
            new actions.ClientUserCreateSuccessAction(response)
          ]);
        })
        .catch((err) => {
          return this.handleFail(err, 'ADMIN.SHARED.USER_CREATE_FAIL', [
            Observable.of(new actions.ClientUserCreateFailAction(err))
          ]);
        }));

  @Effect() createEpsUser$: Observable<Action> = this.actions$
    .ofType(actions.EPS_USER_CREATE)
    .switchMap(action =>
      this.userRestService.createEpsUser(action.payload)
        .switchMap((response: any) => {
          const modalData: Modal = {
            type: 'success',
            titleCode: 'SUCCESS',
            messageCode: 'ADMIN.SHARED.USER_CREATE_SUCCESS',
            redirectUrl: '/admin/epsUsers',
            buttonText: 'SHARED.BUTTONS.GO_TO_OVERVIEW',
            disableClose: false,
            params: response,
            copyToClipboard: `${response.mail} ${response.password}`,
          };
          return Observable.from([
            new ShowModalAction(modalData),
            new actions.EpsUserCreateSuccessAction(response)
          ]);
        })
        .catch((err) => {
          return this.handleFail(err, 'ADMIN.SHARED.USER_CREATE_FAIL', [
            Observable.of(new actions.EpsUserCreateFailAction(err))
          ]);
        }));

  @Effect() getSoldTosForSalesOrganisation$: Observable<Action> = this.actions$
    .ofType(actions.CLIENT_USER_LOAD_SOLDTOS)
    .switchMap(action =>
      this.customersRestService.getSoldTosForSalesOrganisation(action.payload.salesOrganisationId)
        .map((userContext) => {
          return new actions.ClientUserLoadSoldTosSuccessAction({
            soldTos: userContext.items.map(c => {
              return {
                id: c.customerNumber,
                name: c.customerName
              }
            })
          });
        })
        .catch((err) => {

            return this.handleFail(err, 'Get sold-tos', [
              Observable.of(new actions.ClientUserLoadSoldTosFailAction(err))
            ]);
          }
        )
    );

  @Effect() getShipTosForSoldTo$: Observable<Action> = this.actions$
    .ofType(actions.CLIENT_USER_LOAD_SHIPTOS)
    .switchMap(action =>
      this.customersRestService.getShipTosForSoldTo(action.payload.soldToId)
        .map((userContext) => {
          return new actions.ClientUserLoadShipTosSuccessAction({
            shipTos: userContext.items.map(c => {
              return {
                id: c.customerNumber,
                name: c.customerName
              }
            })
          });
        })
        .catch((err) => {

            return this.handleFail(err, 'Get ship-tos', [
              Observable.of(new actions.ClientUserLoadShipTosFailAction(err))
            ]);
          }
        )
    );

  @Effect()
  downloadBulkClientUserSheet: Observable<Action>
    = this.actions$
    .ofType(actions.CLIENT_USER_BULK_DOWNLOAD_EXAMPLE)
    .debounceTime(50)
    .switchMap(action =>
      this.userRestService.downloadExampleBulkClientUsersSheet()
        .map((data: any) => {
          const filenameRegexResult = (/filename=([^;]*)/g).exec(data.headers.get('content-disposition'));
          const filename = filenameRegexResult.length && filenameRegexResult[1] || 'sheet.xlsx';
          return new actions.ClientUserBulkDownloadExampleSuccessAction({ filename, blob: data._body });
        })
        .catch(err => this.handleFail(err, 'FLOWS.NOTIFICATIONS.DOWNLOAD_FILE', [Observable.of(new actions.ClientUserBulkDownloadExampleFailAction(err))]))
    );

  @Effect()
  uploadBulkClientUserSheet: Observable<Action>
    = this.actions$
    .ofType(actions.CLIENT_USER_BULK_UPLOAD)
    .debounceTime(50)
    .switchMap(action =>
      this.userRestService.createInviteBulkClientUsersSheetUpload(action.payload)
        .map((data: any) => {
          const filenameRegexResult = (/filename=([^;]*)/g).exec(data.headers.get('content-disposition'));
          const filename = filenameRegexResult.length && filenameRegexResult[1] || 'sheet.xlsx';
          return new actions.ClientUserBulkUploadResponseAction({ filename, blob: data._body });
        })
        .catch(err => this.handleFail(err, 'FLOWS.NOTIFICATIONS.DOWNLOAD_FILE', [Observable.of(new actions.ClientUserBulkUploadFailAction(err))]))
    );

  @Effect() reInviteUser$: Observable<Action> = this.actions$
    .ofType(actions.USER_RE_INVITE)
    .switchMap(action =>
      this.userRestService.reInviteUser(action.payload.userId)
        .switchMap(response => {
          const modalData: Modal = {
            type: 'success',
            titleCode: 'SUCCESS',
            messageCode: 'ADMIN.SHARED.USER_RE_INVITE_SUCCESS',
            redirectUrl: action.payload.overviewUrl,
            buttonText: 'SHARED.BUTTONS.GO_TO_OVERVIEW',
            disableClose: false,
            params: response,
          };
          return Observable.from([
            new ShowModalAction(modalData),
            new actions.UserReInviteSuccessAction()
          ]);
        })
        .catch((err) => {
          return this.handleFail(err, 'ADMIN.SHARED.USER_RE_INVITE_FAIL', [
            Observable.of(new actions.UserReInviteFailAction(err))
          ]);
        }));

  @Effect() resetPasswordUser$: Observable<Action> = this.actions$
    .ofType(actions.USER_RESET_PASSWORD)
    .switchMap(action =>
      this.userRestService.resetPasswordUser(action.payload.userId)
        .switchMap((response: PasswordResetResponse) => {
          if (response.success) {
            const modalData: Modal = {
              type: 'success',
              titleCode: 'SUCCESS',
              messageCode: 'ADMIN.SHARED.USER_RESET_PASSWORD_SUCCESS',
              redirectUrl: action.payload.overviewUrl,
              buttonText: 'SHARED.BUTTONS.GO_TO_OVERVIEW',
              disableClose: false,
              params: response,
              copyToClipboard: response.newPassword
            };
            return Observable.from([
              new ShowModalAction(modalData),
              new actions.UserResetPasswordSuccessAction()
            ]);
          } else {
            return this.handleFail('', 'ADMIN.SHARED.USER_RESET_PASSWORD_FAIL', [
              Observable.of(new actions.UserResetPasswordFailAction(null))
            ]);
          }
        })
        .catch((err) => {
          return this.handleFail(err, 'ADMIN.SHARED.USER_RESET_PASSWORD_FAIL', [
            Observable.of(new actions.UserResetPasswordFailAction(err))
          ]);
        }));


}
