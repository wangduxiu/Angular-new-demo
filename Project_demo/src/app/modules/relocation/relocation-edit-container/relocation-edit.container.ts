import { Component, Injector, OnInit } from '@angular/core';
import { RelocationSandbox } from 'app/core/sandboxes/relocation.sandbox';
import { RecurrenceService } from 'app/core/services/recurrence.service';
import { MaterialTypes } from 'app/core/store/contract-details/contract-details.interface';
import * as templateActions from 'app/core/store/template/template.actions';
import { TemplateState } from 'app/core/store/template/template.interface';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { fadeInAnimation } from '../../../animations';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { FlorderDetail, Material } from '../../../core/store/florder-detail/florder-detail.interface';
import { Place } from '../../../core/store/florders/place.interface';
import * as relocationActions from '../../../core/store/relocation-detail/relocation-detail.actions';
import { EditRelocationDetail, LoadingDates } from '../../../core/store/relocation-detail/relocation-detail.interface';
import { FlorderEditContainer } from '../../florders/florder-edit-container/florder-edit.container';

@Component({
  selector: 'app-relocation-edit',
  templateUrl: './relocation-edit.container.html',
  styleUrls: ['../../florders/florder-edit-container/florder-edit.container.less'],
  animations: [fadeInAnimation],
})
export class RelocationEditContainer extends FlorderEditContainer implements OnInit {

  relocationDetail: FlorderDetail;
  locations: Place[];
  availableLoadingDates: LoadingDates;
  materialTypes: MaterialTypes;

  templateState: TemplateState;

  constructor(
    injector: Injector,
    private simplePageScrollService: SimplePageScrollService,
    private recurrenceService: RecurrenceService,
    private sandbox: RelocationSandbox,
  ) {
    super(injector);

    this.store.select('editRelocationDetail').takeWhile(() => !this.destroyed).map((editRelocationDetail: EditRelocationDetail) => editRelocationDetail).distinctUntilChanged().filter(val => val.mode.saved).subscribe(value => {
      if (!value.recurrenceDates || value.recurrenceDates.length === 1) {
        this.openCreateFeedbackDialog({ success: value.mode.saveSuccess, etmOrderNumber: value.relocationDetail.etmOrderNumber, salesOrderNumber: value.relocationDetail.salesOrderNumber });
      }
    });

    this.store.select('template').takeWhile(() => !this.destroyed).subscribe((templateState: TemplateState) => this.templateState = templateState);

    this.store.select('editRelocationDetail').takeWhile(() => !this.destroyed).filter((editRelocationDetail: EditRelocationDetail) => !!editRelocationDetail.relocationDetail).subscribe((editRelocationDetail: EditRelocationDetail) => {
      this.mode = editRelocationDetail.mode;
      const materialEdit = !!(editRelocationDetail.relocationDetail && editRelocationDetail.relocationDetail.materials && editRelocationDetail.mode.material);
      const materialExists = materialEdit && editRelocationDetail.relocationDetail.materials.find(m => m.internalId === editRelocationDetail.mode.material.internalId) != null;
      this.panelStatus = this.getPanelStatusses(materialEdit, materialExists);
      this.relocationDetail = editRelocationDetail.relocationDetail;
      this.availableLoadingDates = editRelocationDetail.availableLoadingDates;

      if (editRelocationDetail.mode.state === 'recurrence-dates' && !this.recurrenceService.isOpen() && editRelocationDetail.recurrenceDates) {
        this.recurrenceService.openRecurrenceDatesDialog({
          statePath: 'editRelocationDetail',
          cb: this.create.bind(this),
          openGoParams: (relocation: FlorderDetail) => [`/relocations/${relocation.etmOrderNumber}`, { salesOrderNumber: relocation.salesOrderNumber, back: this.backUrl }],
          backToConfirmAction: new relocationActions.RelocationDetailBackToCreateConfirm(),
          createButtonLabel: 'RELOCATIONS.RECURRENCE.CREATE',
          gotoOverviewUrl: '/relocations'
        });
      }
      this.materialTypes = editRelocationDetail.materialsState.data;
    });

    this.store.select('definitions').takeWhile(() => !this.destroyed).subscribe((definitions: Definitions) => {
      this.locations = definitions.places;
    });
  }

  downloadDocument(documentId: string, extension: string): void {
    throw new Error('Unsupported operation exception');
  }

  ngOnInit(): void {
    this.simplePageScrollService.scrollToElement('#top', 0);
  }

  editDeliveryMethodClicked() {
    this.store.dispatch(new relocationActions.RelocationDetailEditDeliveryMethod());
  }

  editDetailClicked() {
    this.store.dispatch(new relocationActions.RelocationDetailCreateEditOrderDetail());
  }

  editPlanningClicked(): void {
    this.sandbox.editPlanning();
  }

  setDeliveryMethod(form): void {
    // First load materials (into state)
    this.sandbox.loadMaterials(form.from.id).subscribe(() => {
      // Then go to edit details
      this.store.dispatch(new relocationActions.RelocationDetailCreateSetDeliveryMethod({ deliveryMethod: form }));
    });
  }

  removeMaterial(material): void {
    this.store.dispatch(new relocationActions.RelocationDetailCreateRemoveMaterial(material));
  }

  editMaterial(material) {
    this.store.dispatch(new relocationActions.RelocationDetailCreateStartEditMaterial(material));
  }

  getMaterials(): Material[] {
    return this.relocationDetail.materials;
  }

  saveMaterial(material) {
    if (this.checkMaterialIsUnique(material)) {
      this.store.dispatch(new relocationActions.RelocationDetailCreateSaveMaterialStart({ material: material, showPopup: true }));
    }
  }

  saveDetails() {
    this.sandbox.saveDetails();
  }

  savePlanning(form) {
    this.store.dispatch(new relocationActions.RelocationDetailSavePlanning(form));
  }

  submitClicked() {
    this.create();
  }

  get disableButtons(): boolean {
    return this.templateState && this.templateState.saving || this.mode && (this.mode.saving || this.mode.state === 'recurrence-dates');
  }

  protected openCreateFeedbackDialog({ success, etmOrderNumber, salesOrderNumber }): void {
    super.openCreateFeedbackDialog({
      success,
      etmOrderNumber,
      salesOrderNumber,
      messageType: '',
      ccrNumber: null,
      incoterm: null,
      showDownloadDocumentButton: true,
      showCreateButton: true,
      moduleRoute: 'relocations',
      createAction: new relocationActions.RelocationDetailCreateStart({ date: null }),
    });
  }

  /**
   * Method to finalize creation of an order or template.  Now dialog windows can appear if needed, or the order / template is created immediately.
   *
   * possible outcomes:
   * - Is a template ==> create template
   * - Is a 'create order' with recurrence on and unloadingDate not yet an array ==> open recurrence dialog
   * - Is a 'create order' with recurrence on, with emailAddresses list ==> open recurrence dialog
   * - Is a 'create order' without recurrence but customer has emailAddresses list ==> Open email dialog
   * - Is a 'create order' without recurrence, without emailAddresses list ==> Create order
   */
  create(unloadingDates?: string[]) {
    if (this.mode.createTemplate || this.mode.editTemplate) {
      this.store.dispatch(new templateActions.TemplateSaveFromRelocationAction({ silentSuccess: false, create: this.mode.createTemplate }));
    } else {
      // Check for recurrence without array of dates
      if (this.relocationDetail.planning.recurrence && this.relocationDetail.planning.recurrence.active && !unloadingDates) {
        this.sandbox.loadRecurrenceDates(this.relocationDetail);
      } else {
        this.sandbox.createRelocations(unloadingDates);
      }
    }
  }
}
