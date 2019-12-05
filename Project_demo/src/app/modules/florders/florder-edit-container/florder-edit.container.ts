import { ChangeDetectorRef, Injector } from '@angular/core';
import { MdDialog, MdDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { go } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { AzureMonitoringService } from '../../../core/services/AzureMonitoringService';
import { Adal } from '../../../core/store/adal/adal.interface';
import { CDIncoterm, CDTo } from '../../../core/store/contract-details/contract-details.interface';
import { Definitions } from '../../../core/store/definitions/definitions.interface';
import { Materialish } from '../../../core/store/florder-detail/florder-detail.interface';
import { ShowNotificationAction } from '../../../core/store/notification/notification.actions';
import { UserContext } from '../../../core/store/user-context/user-context.interface';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { BaseContainer } from '../../base/BaseContainer';
import { PanelStatus } from './florder-edit.interface';

interface ButtonStatus {
  isVisible: boolean;
  isEnabled: boolean;
}

export abstract class FlorderEditContainer extends BaseContainer {
  backUrl: string;
  to: CDTo;
  incoterm: CDIncoterm;
  definitions: Definitions;
  mode: any;
  private firstName: string;
  panelStatus: {
    delivery: PanelStatus;
    detail: PanelStatus;
    material: PanelStatus;
    planning: PanelStatus;
    backButton: ButtonStatus;
    submitButton: ButtonStatus;
    ccr: {
      isEdit: boolean;
    };
    busy: boolean;
  };

  formsAreValid: {
    all: boolean,
    delivery: boolean,
    detail: boolean,
    planning: boolean
  } = { planning: false, delivery:false, detail:false, all: false };

  protected route: ActivatedRoute;
  protected dialog: MdDialog;
  private cd: ChangeDetectorRef;

  constructor(injector: Injector) {
    super(injector.get(Store), injector.get(AzureMonitoringService));
    this.route = injector.get(ActivatedRoute);
    this.dialog = injector.get(MdDialog);
    this.cd = injector.get(ChangeDetectorRef);
    this.route.params.subscribe(params => {
      this.backUrl = params.back || 'dashboard';
    });
    this.store.select('definitions').takeWhile(() => !this.destroyed).subscribe(definitions => this.definitions = definitions as Definitions);

    this.store.select('session').takeWhile(() => !this.destroyed).subscribe((session: { userContext: UserContext; adal: Adal }) => {
      const userContext = session.userContext;
      if (userContext) {
        this.firstName = userContext.firstName;
      }
    });
  }

  formValidChanged(panel, value) {
    this.formsAreValid[panel] = value;
    this.formsAreValid.all = this.formsAreValid.detail && this.formsAreValid.delivery && this.formsAreValid.planning;
    this.cd.markForCheck();
  }

  protected getPanelStatusses(materialEdit: boolean, materialExists: boolean) {
    const panelStatus = {
      delivery: {
        isVisible: this.mode.state !== 'create' || this.mode.state === 'edit' || this.mode.editWindow === 'detail' || this.mode.type === 'ccr',
        isEdit: (this.mode.state === 'create' || this.mode.state === 'edit' || this.mode.state === 'create-confirm') && this.mode.editWindow === 'delivery',
        isEditable: (this.mode.state === 'create-confirm' || this.mode.state === 'edit-confirm') && this.mode.editWindow === null,
        isNew: this.mode.state === 'create',
        isUpdate: this.mode.state === 'create-confirm',
        isView: this.mode.state === 'view',
        createTemplate: this.mode.createTemplate,
        editTemplate: this.mode.editTemplate,
        busy: false
      },
      detail: {
        isVisible: (this.mode.state === 'create' && this.mode.editWindow !== 'delivery') || this.mode.state === 'create-confirm' || this.mode.state === 'edit' || this.mode.state === 'edit-confirm' || this.mode.state === 'view' || this.mode.type === 'ccr',
        isEdit: (this.mode.state === 'create' || this.mode.state === 'edit' || this.mode.state === 'create-confirm') && this.mode.editWindow === 'detail',
        isEditable: (this.mode.state === 'create-confirm' || this.mode.state === 'edit-confirm') && this.mode.editWindow === null,
        isNew: this.mode.state === 'create',
        isUpdate: this.mode.state === 'create-confirm',
        isView: this.mode.state === 'view',
        createTemplate: this.mode.createTemplate,
        editTemplate: this.mode.editTemplate,
        busy: this.mode.saving,
        saving: this.mode.datesLoading
      },
      material: {
        isVisible: this.mode.state !== 'create' || this.mode.state !== 'edit' || this.mode.state === 'create-confirm' || this.mode.type === 'ccr',
        isEdit: (this.mode.state === 'create' || this.mode.state === 'edit' || this.mode.state === 'create-confirm') && this.mode.editWindow === 'detail' && materialEdit,
        isEditable: this.mode.state === 'create' || this.mode.state === 'create-confirm',
        isView: this.mode.state === 'view',
        createTemplate: this.mode.createTemplate,
        editTemplate: this.mode.editTemplate,
        isNew: !materialExists,
        isUpdate: materialExists,
        busy: this.mode.saving
      },
      planning: {
        isVisible: (this.mode.state === 'create' && this.mode.editWindow === 'planning') || this.mode.state === 'create-confirm' || this.mode.state === 'view' || this.mode.type === 'ccr' || this.mode.state === 'edit' || this.mode.state === 'edit-confirm',
        isEdit: (this.mode.state === 'create' || this.mode.state === 'edit' || this.mode.state === 'create-confirm') && this.mode.editWindow === 'planning',
        isEditable: this.mode.state === 'create-confirm' && this.mode.editWindow === null,
        isNew: this.mode.state === 'create',
        isView: this.mode.state === 'view',
        isUpdate: this.mode.state === 'create-confirm',
        createTemplate: this.mode.createTemplate,
        editTemplate: this.mode.editTemplate,
        busy: this.mode.saving,
        opening: this.mode.state === 'create-confirm' && this.mode.openingWindow === 'planning'
      },
      backButton: {
        isVisible: this.mode.state === 'view',
        isEnabled: true
      },
      submitButton: {
        isVisible: (this.mode.state === 'create-confirm' || this.mode.state === 'edit-confirm') && this.mode.editWindow === null,
        isEnabled: !this.mode.saving
      },
      ccr: {
        isEdit: false
      },
      busy: false
    };
    panelStatus.busy = panelStatus.planning.opening || panelStatus.planning.busy || panelStatus.detail.busy || panelStatus.detail.saving || panelStatus.delivery.busy;
    return panelStatus;
  }

  protected openCreateFeedbackDialog(parameters: { 
    success: boolean,
    etmOrderNumber: string,
    salesOrderNumber: string,
    ccrNumber: string,
    moduleRoute: string,
    messageType: string,
    incoterm: string,
    showDownloadDocumentButton: boolean,
    showCreateButton: boolean,
    createAction: Action,
  }) {
    const { success, etmOrderNumber, ccrNumber, salesOrderNumber, moduleRoute, showDownloadDocumentButton, messageType, incoterm, showCreateButton, createAction } = parameters;
   
    if (success && this.dialog._openDialogs.length === 0) { // If fail, we already have a dialog !
      const modalData: object = {
        showDownloadDocumentButton,
        showCreateButton,
        type: success ? 'success' : 'error',
        name: this.firstName,
        headerTranslationCode: success ? `SHARED.MODAL.HEADER_${messageType}SUCCESS` : `SHARED.MODAL.HEADER_${messageType}ERROR`,
        bodyTranslationCode: success ? (!incoterm || incoterm === '-' ? `SHARED.MODAL.MSG_${messageType}SUCCESS` : `SHARED.MODAL.MSG_DL40_SUCCESS`)  : `SHARED.MODAL.MSG_${messageType}ERROR`,
        number: etmOrderNumber,
        detailButtonText: 'SHARED.BUTTONS.GO_TO_DETAIL',
        overviewButtonText: 'SHARED.BUTTONS.GO_TO_OVERVIEW',
        downloadButtonText: 'SHARED.BUTTONS.DOWNLOAD_DOCUMENT',
        createButtonText: 'SHARED.BUTTONS.CREATE_A_NEW_ONE',
      };
      const config: MdDialogConfig = {
        width: '80%',
        height: 'auto',
        data: modalData,
        role: 'dialog',
        disableClose: true,
      };

      // TODO use ShowNotificationAction (or ShowModalAction ?).  Don't open dialog here.  There is a counter that avoids multiple dialogs
      const dialogRef = this.dialog.open(ModalComponent, config);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // route.params remains empty so have to try to get them again
          this.route.queryParams.subscribe(params => {
            this.backUrl = params.back || 'dashboard';
            if (result.downloadDocument) {
              this.downloadDocument(ccrNumber ? ccrNumber : etmOrderNumber, "PDF");
            }

            // redirect to overview or detail page
            if (result.goToOverview) {
              // go to overview
              this.store.dispatch(go([`/${moduleRoute}/refresh`]));
            }
            if (result.goToDetail) {
              // go to detail
              if (salesOrderNumber) {
                this.store.dispatch(go([`/${moduleRoute}/${etmOrderNumber}`, { salesOrderNumber, back: this.backUrl }]));
              } else {
                this.store.dispatch(go([`/${moduleRoute}/${etmOrderNumber}`, { back: this.backUrl }]));
              }
            }
            if (result.goToCreate) {
              // go to create
              this.store.dispatch(createAction);
            }
          });
        }
      });
    }
  }

  abstract downloadDocument(documentId: string, extension: string): void;

  protected checkMaterialIsUnique(material): boolean {
    const existingMaterial = this.getMaterials().find(m => {
      let isEqual = (m.type === material.type);
      switch (m.type) {
        case 'pallet':
          isEqual = isEqual && (m.palletId === material.palletId);
          isEqual = isEqual && (m.packingStatus === material.packingStatus);
          isEqual = isEqual && (m.logisticsVarietyPacking === material.logisticsVarietyPacking);
          break;
        case 'packing':
          isEqual = isEqual && (m.packingId === material.packingId);
          isEqual = isEqual && (m['contentId'] === material['contentId']);
          isEqual = isEqual && (m['lineReferenceId'] === material['lineReferenceId']);
          isEqual = isEqual && (m.packingStatus === material.packingStatus);
          isEqual = isEqual && (m.logisticsVarietyPacking === material.logisticsVarietyPacking);
          break;
        case 'combination':
          isEqual = isEqual && (m.palletId === material.palletId);
          isEqual = isEqual && (m.packingId === material.packingId);
          isEqual = isEqual && (m.packingStatus === material.packingStatus);
          isEqual = isEqual && (m.logisticsVarietyPacking === material.logisticsVarietyPacking);
          isEqual = isEqual && m['packingsPerPallet'] === material.packingsPerPallet;
          break;
      }
      return isEqual;
    });
    if (existingMaterial && existingMaterial.internalId !== material.internalId) {
      this.store.dispatch(new ShowNotificationAction({ type: 'warning', messageCode: 'ORDERS.MATERIAL.NOTIFICATIONS.MATERIAL_ALREADY_EXISTS', modal: true, disableClose: false  }));
      return false;
    }
    return true;
  }


  abstract editDeliveryMethodClicked();

  abstract editDetailClicked();

  abstract editPlanningClicked();

  abstract setDeliveryMethod(form);

  abstract removeMaterial(material);

  abstract editMaterial(material);

  abstract saveMaterial(material);

  abstract getMaterials(): Materialish[];

  abstract create(data);

  cancelClicked() {
    this.store.dispatch(go(this.backUrl));
  }

  abstract saveDetails(form);

  abstract savePlanning(form);

  abstract submitClicked();
}
