import { Injectable } from '@angular/core';
import { MdDialog } from '@angular/material';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import { Observable } from 'rxjs/Observable';
import { RootState } from '..';
import { AzureMonitoringService } from '../../services/AzureMonitoringService';
import { OrderRestService } from '../../services/rest/order.rest.service';
import { RelocationRestService } from '../../services/rest/relocation.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import { ShowNotificationAction } from '../notification/notification.actions';
import * as actions from './relocation-detail.actions';

@Injectable()
export class RelocationDetailEffects extends AbstractEffects {

  constructor(
    private store: Store<RootState>,
    azureMonitoringService: AzureMonitoringService,
    private actions$: Actions,
    private relocationRestService: RelocationRestService,
    translateService: TranslateService,
    public dialog: MdDialog,
    private orderRestService: OrderRestService,
  ) {
    super(translateService, azureMonitoringService);
  }

  @Effect() calculateLoadAddMaterialSkipPalletFloorQuantity$ = this.actions$
    .ofType(actions.RELOCATIONDETAIL_CREATE_SAVE_MATERIAL_START)
    .switchMap((action) => {
      return Observable.of(new actions.RelocationDetailCreateSaveMaterialSuccess({
        calculation: null, material: action.payload.material
      }));
    });

  @Effect()
  calculateAfterRemoveMaterial$
    = this.actions$
    .ofType(actions.RELOCATIONDETAIL_CREATE_DELETE_MATERIAL)
    .withLatestFrom(this.store, (action, state) => {
      return { payload: action.payload, state };
    })
    .switchMap(({ payload, state }) => {
      const showNotificationAction = new ShowNotificationAction({
        type: 'success', messageCode: 'ORDERS.MATERIAL.NOTIFICATIONS.MATERIAL_REMOVED', modal: false, disableClose: false
      });

      return Observable.of(showNotificationAction)
    });

  @Effect()
  loadRelocation$: Observable<Action>
    = this.actions$
    .ofType(actions.RELOCATIONDETAIL_OPEN)
    .debounceTime(50)
    .map(action => action.payload)
    .switchMap((ids: { etmOrderNumber; salesOrderNumber }) => {
      return this.relocationRestService
        .getRelocation(ids.etmOrderNumber, ids.salesOrderNumber)
        .map(result => new actions.RelocationDetailOpenSuccess(result))
        .catch((err) => this.handleFail(err, 'RELOCATIONS.LABELS.OPEN_RELOCATION', [
            Observable.of(new actions.RelocationDetailOpenFail(err)),
          ])
        );
    });

}
