import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { go } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { RelocationRestService } from 'app/core/services/rest/relocation.rest.service';
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
import { TemplateRestService } from '../../services/rest/template.rest.service';
import { AbstractEffects } from '../AbstractEffects';
import { ShowNotificationAction } from '../notification/notification.actions';
import * as actions from './template.actions';
import { TemplatesDeleteAction, TemplatesLoadAction, TemplatesStartEditAction } from './template.actions';

@Injectable()
export class TemplateEffects extends AbstractEffects {

  constructor(
    private store: Store<RootState>,
    azureMonitoringService: AzureMonitoringService,
    private actions$: Actions,
    private templateRestService: TemplateRestService,
    private orderRestService: OrderRestService,
    private relocationRestService: RelocationRestService,
    translateService: TranslateService) {
    super(translateService, azureMonitoringService);
  }

  @Effect() createTemplateFromOrderCreate$: Observable<Action> =
    this.actions$
        .ofType(actions.TEMPLATE_SAVE_FROM_ORDER)
        .debounceTime(50)
        .withLatestFrom(this.store, (action, state) => {
          return { payload: action.payload, state };
        })
        .switchMap(({ payload, state }) => {
          return this.templateRestService
                     .createTemplate('ORDER', state.editOrderDetail.orderDetail)
                     .map(result => new actions.TemplateSaveSuccessAction({...payload, returnUrl: '/orders'}))
                     .catch((err) => this.handleFail(err, 'ERRORS.TEMPLATE.CREATE', [
                         Observable.of(new actions.TemplateSaveFailAction(err))
                       ])
                     );
        });

  @Effect() createTemplateCreateSuccess$: Observable<Action> =
    this.actions$
        .ofType(actions.TEMPLATE_SAVE_SUCCESS)
        .filter(action => !action.payload || !action.payload.silentSuccess)
        .switchMap(action => {
          return Observable.of(new ShowNotificationAction({ type: 'success', messageCode: action.payload.create ? 'TEMPLATES.DETAILS.CREATE_SUCCESS' : 'TEMPLATES.DETAILS.EDIT_SUCCESS', modal: true, disableClose: false, redirectUrl: action.payload.returnUrl }));
        });

  @Effect() createTemplateFromRelocationCreate$: Observable<Action> =
    this.actions$
        .ofType(actions.TEMPLATE_SAVE_FROM_RELOCATION)
        .debounceTime(50)
        .withLatestFrom(this.store, (action, state) => {
          return { payload: action.payload, state };
        })
        .switchMap(({ payload, state }) => {
          return this.templateRestService
                     .createTemplate('RELOCATION', state.editRelocationDetail.relocationDetail)
                     .map(result => new actions.TemplateSaveSuccessAction({...payload, returnUrl: '/relocations'}))
                     .catch((err) => this.handleFail(err, 'ERRORS.TEMPLATE.CREATE', [
                         Observable.of(new actions.TemplateSaveFailAction(err))
                       ])
                     );
        });

  @Effect() copyRelocationForTemplate$ =
    this.actions$
        .ofType(actions.TEMPLATE_COPY_FROM_RELOCATION)
        .withLatestFrom(this.store, (action, state) => {
          return { payload: action.payload, state };
        })
        .switchMap(({payload, state}) => {
          return this.relocationRestService.getRelocation(payload.etmOrderNumber, payload.salesOrderNumber)
                     .map(result => {
                         return new actions.TemplateCreateFromRelocationSuccess({ relocationDetail: result, definitions: state.definitions });
                     })
                     .catch((err) => this.handleFail(err, 'ERRORS.TEMPLATE.COPY_FROM_ORDER', []));
        });


@Effect() copyRelocationRequestDeliveryDate$ = this.actions$
        .ofType(actions.TEMPLATE_COPY_FROM_RELOCATION_SUCCESS)
        .withLatestFrom(this.store, (action, state) => {
          return { payload: action.payload, state };
        })
        .switchMap(({ payload: order, state }) => {
            return Observable.of(go('/relocations/template/copy'));
        });

  @Effect() loadTemplates$: Observable<Action> = this.actions$
          .ofType(actions.TEMPLATES_LOAD)
          .debounceTime(50) // Avoid double click
          .switchMap((action: TemplatesLoadAction) =>
            this.templateRestService.getTemplates(action.payload.type)
                .map(templateArray =>
                  new actions.TemplatesLoadSuccessAction(templateArray))
                .catch((err) => this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
                    Observable.of(new actions.TemplatesLoadFailAction(err))
                  ])
                )
          );

  @Effect() deleteTemplate$: Observable<Action> =
    this.actions$
        .ofType(actions.TEMPLATES_DELETE)
        .switchMap((action: TemplatesDeleteAction) => {
          return this.templateRestService
                     .deleteTemplate(action.payload.type, action.payload  .templateId)
                     .map(result => new actions.TemplatesDeleteSuccessAction(result))
                     .catch((err) => this.handleFail(err, 'ERRORS.TEMPLATE.CREATE', [
                         Observable.of(new actions.TemplatesDeleteFailAction(err))
                       ])
                     );
        });

  @Effect() startOrderEditTemplate$: Observable<Action> =
    this.actions$
      .ofType(actions.TEMPLATES_START_EDIT)
      .switchMap((action: TemplatesStartEditAction) =>
        this.templateRestService.getTemplate(action.payload.type, action.payload.templateId)
          .map(template =>
            new actions.TemplatesStartEditSuccessAction({template, type: action.payload.type}))
          .catch((err) => this.handleFail(err, 'ERRORS.FILTER_FAILED.TITLE', [
              Observable.of(new actions.TemplatesStartEditFailAction(err))
            ])
          )
      );

  @Effect() startEditSuccessTemplate$: Observable<Action> =
    this.actions$
      .ofType(actions.TEMPLATES_START_EDIT_SUCCESS)
      .withLatestFrom(this.store, (action, state) => {
        return { payload: action.payload, state };
      })
      .switchMap(({ payload, state }) => {
        switch (payload.type) {
          case 'ORDER':
            return Observable.from([go([`/orders/template/edit/${payload.template.id}`]), new actions.OrderTemplateEditAction({ template: payload.template, definitions: state.definitions })]);
          case 'RELOCATION':
            return Observable.from([go([`/relocations/template/edit/${payload.template.id}`]), new actions.RelocationTemplateEditAction({ template: payload.template })]);
        }
      })

}

