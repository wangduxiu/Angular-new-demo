import { Injectable } from '@angular/core';
import { go } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AbstractSandbox } from 'app/core/sandboxes/abstract.sandbox';
import { OrderRestService } from 'app/core/services/rest/order.rest.service';
import { RelocationRestService } from 'app/core/services/rest/relocation.rest.service';
import { MaterialTypes } from 'app/core/store/contract-details/contract-details.interface';
import { FlorderDetail, OrderDetailTO } from 'app/core/store/florder-detail/florder-detail.interface';
import { Florder } from 'app/core/store/florders/florder.interface';
import { RecurrenceDates } from 'app/core/store/order-detail/order-detail.interface';
import * as relocationActions from 'app/core/store/relocation-detail/relocation-detail.actions';
import * as templateActions from 'app/core/store/template/template.actions';
import 'rxjs/add/operator/delay';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AzureMonitoringService } from '../services/AzureMonitoringService';
import * as fromRoot from '../store';
import * as actions from '../store/relocation-detail/relocation-detail.actions';
import { ShowModalAction } from '../store/modal/modal.actions';
import { Modal } from '../store/modal/modal.interface';

@Injectable()
export class RelocationSandbox extends AbstractSandbox {

  constructor(
    store: Store<fromRoot.RootState>,
    translateService: TranslateService,
    azureMonitoringService: AzureMonitoringService,
    private relocationRestService: RelocationRestService,
    private orderRestService: OrderRestService,
  ) {
    super(store, translateService, azureMonitoringService);
  }

  /**
   * Go to edit planning, but first trigger load of loadingDates
   */
  editPlanning(): Observable<void> {
    return this.loadAndNextAction(new relocationActions.RelocationDetailCreateEditOrderPlanning());
  }

  /**
   * Save panel 2: details (materials), but first trigger load of loadingDates
   */
  saveDetails(): Observable<void> {
    return this.loadAndNextAction(new relocationActions.RelocationDetailSaveOrderDetail());
  }

  /**
   * Copy a relocation, without using effects
   * @param etmOrderNumber
   * @param salesOrderNumber
   */
  copyRelocation(etmOrderNumber: string): void {
    this.store.dispatch(new actions.RelocationDetailCopyOrder({ etmOrderNumber }));

    this.store.take(1).subscribe(state => {
      this.relocationRestService
        .getRelocation(etmOrderNumber, 'X') // UAT 1840 + explanation Piet Borgman, mail 10/08/18 16:39 see mail-piet-2018-08-10-copy-order.png
        .subscribe(
          (relocationTO: OrderDetailTO) => {
            this.store.dispatch(new actions.RelocationDetailCopyOpenSuccess({ relocationDetail: relocationTO, definitions: state.definitions }));
            // Next step: set mode to 'edit planning', load dates
            //         return Observable.from([new actions.OrderDetailRequestDeliveryDates(new actions.OrderDetailCreateEditOrderPlanningGetDatesSuccess()), new actions.OrderDetailCreateSaveMaterialStart({ material: extendedLineItems[0], preventRestCall: false, showPopup: false }), go('/orders/copy')]);

            this.loadMaterials().subscribe(() => {
              // Next step: go to edit page
              this.store.dispatch(go('/relocations/copy'));
              this.editPlanning();
            });
          },
          (err) => {
            this.handleFail(err, 'RELOCATIONS.DETAIL.LABELS.COPY_RELOCATION');
            this.store.dispatch(new actions.RelocationDetailOpenFail(err));
          });
    });
  }

  createRelocationFromTemplate(templateId: string, date: string) {
    this.store.dispatch(go(`relocations/new/fromTemplate/${templateId}`, { date }));
    setTimeout(() => {
      this.loadMaterials().subscribe(() => {
        this.editPlanning()
      });
    });
  }

  /**
   * Load recurrence dates when clicking on 'submit'
   */
  loadRecurrenceDates(recurrenceDetail: FlorderDetail) {
    this.store.dispatch(new actions.RelocationDetailGetRecurrenceDates(recurrenceDetail));
    this.store.take(1).subscribe(state => {
      this.relocationRestService
        .getRecurrenceDates(state.editRelocationDetail.relocationDetail)
        .subscribe(
          (data: RecurrenceDates) => {
            this.store.dispatch(new actions.RelocationDetailGetRecurrenceDatesSuccess(data));
          },
          err => {
            this.handleFail(err, `ERRORS.GET_RECURRENCE_DATES.TITLE`);
            this.store.dispatch(new actions.RelocationDetailGetRecurrenceDatesFail(err))
          })
    });
  }

  /**
   * Load materials for relocation
   * @param depotId depot from where relocation departs.  If not given, take the from-id from the state
   * @returns an observable<void> for enabling you to chain a next event
   */
  loadMaterials(depotId?: string): Observable<void> {
    const subject = new Subject<void>();

    this.store
      .select(state =>
        state.editRelocationDetail.relocationDetail
        && state.editRelocationDetail.relocationDetail.deliveryMethod
        && state.editRelocationDetail.relocationDetail.deliveryMethod.from
        && state.editRelocationDetail.relocationDetail.deliveryMethod.from.id)
      .startWith(depotId)
      .filter(id => !!id)
      .take(1)
      .subscribe(id => {
        this.store.dispatch(new actions.RelocationDetailGetMaterials({ depotId: id }));
        this.relocationRestService
          .getMaterials(id)
          .subscribe(
            (data: MaterialTypes) => {
              this.store.dispatch(new actions.RelocationDetailGetMaterialsSuccess(data));
              subject.next();
              subject.complete();
            },
            err => {
              this.handleFail(err, `ERRORS.GET_MATERIALS.TITLE`);
              this.store.dispatch(new actions.RelocationDetailGetMaterialsFail(err));
              subject.error(err);
            });
      });

    return subject.asObservable();
  }

  createRelocations(unloadingDates: string[]) {
    this.store.dispatch(new actions.RelocationDetailCreateSubmit({ unloadingDates }));
    this.store.take(1).subscribe(state => {
      let selectedDates;
      if (state.editRelocationDetail.recurrenceDates) {
        selectedDates = state.editRelocationDetail.recurrenceDates.filter(date => date.saving).map(date => date.createDate);
      } else if (Array.isArray(state.editRelocationDetail.relocationDetail.planning.unloadingDate)) {
        selectedDates = state.editRelocationDetail.relocationDetail.planning.unloadingDate;
      } else {
        selectedDates = [state.editRelocationDetail.relocationDetail.planning.unloadingDate as string];
      }
      const relocationDetail = {
        ...state.editRelocationDetail.relocationDetail,
        planning: {
          ...state.editRelocationDetail.relocationDetail.planning,
          unloadingDate: selectedDates
        }
      };

      return this.relocationRestService
        .createRelocation(relocationDetail)
        .subscribe(
          result => {
            this.store.dispatch(new actions.RelocationDetailCreateSubmitSuccess({ result }));

            if (state.editRelocationDetail.relocationDetail.createTemplate) {
              this.store.dispatch(new templateActions.TemplateSaveFromRelocationAction({ silentSuccess: true, create: true }));
            }

          },
          err => {
            this.handleFail(err, 'RELOCATIONS.LABELS.SUBMIT_RELOCATION');
            this.store.dispatch(new actions.RelocationDetailCreateSubmitFail(err));
          }
        );
    });
  }

  createTemplateFromRelocation(relocation: Florder) {
    this.store.dispatch(new templateActions.TemplateCreateFromRelocationStart({ etmOrderNumber: relocation.etmOrderNumber }));
    setTimeout(() => {
      this.loadMaterials().subscribe(() => {
      });
    });

  }

  createTemplate() {
    this.store.dispatch(go(['/relocations/template/new', { back:'relocations' }]));
  }

  private loadLoadingDates(ids: { fromId: string, toId: string }): Observable<void> {
    const result = new Subject<void>();
    this.store.dispatch(new actions.RelocationDetailRequestLoadingDates(ids));

    this.relocationRestService.getLoadingDates(ids).subscribe(
      loadingDatesTO => {
        this.store.dispatch(new actions.RelocationDetailRequestLoadingDatesSuccess(loadingDatesTO));
        result.next();
        result.complete();
      },
      error => {
        this.store.dispatch(new actions.RelocationDetailRequestLoadingDatesFail(error));

        const modalData: Modal = {
          type: 'error',
          titleCode: 'ERROR',
          message: error.Message,
          redirectUrl: '',
          buttonText: 'CLOSE',
          disableClose: false,
        };
        
        this.store.dispatch(new ShowModalAction(modalData));
        result.error(error);
      },
    );
    return result.asObservable();
  }

  /**
   * Helper method to load loadDates and continue
   * @param action action to trigger after successful load
   */
  private loadAndNextAction(action: Action): Observable<void> {
    const subject = new Subject<void>();
    // Get fromId & toId (once)
    this.store
      .take(1)
      .map(state => state.editRelocationDetail)
      .filter(editRelocationDetail => !!editRelocationDetail.relocationDetail.deliveryMethod.from && !!editRelocationDetail.relocationDetail.deliveryMethod.to)
      .subscribe(editRelocationDetail => {
        let fromId = editRelocationDetail.relocationDetail.deliveryMethod.from.id;
        let toId = editRelocationDetail.relocationDetail.deliveryMethod.to.id;
        // Trigger load
        this.loadLoadingDates({ fromId, toId }).subscribe(() => {
          // Dispatch next action
          this.store.dispatch(action);
          subject.next();
          subject.complete();
        })
      });
    return subject.asObservable();
  }
}
