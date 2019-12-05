import {Component, EventEmitter, Injector, OnInit} from '@angular/core';
import {go} from '@ngrx/router-store';
import {FlowSandbox} from 'app/core/sandboxes/flow.sandbox';
import {ContractInfo} from 'app/core/store/contract-info/contract-info.interface';
import {FilterValues} from 'app/core/store/florders/filtervalues.interface';
import {SimplePageScrollService} from 'ng2-simple-page-scroll';
import {fadeInAnimation} from '../../../animations';
import {AppSettings} from '../../../app.settings';
import {CDFlorderType, CDTo} from '../../../core/store/contract-details/contract-details.interface';
import {FlorderDetail, Material} from '../../../core/store/florder-detail/florder-detail.interface';
import * as actions from '../../../core/store/flow-detail/flow-detail.actions';
import {CheckFlowDateResponse, EditFlowDetail} from '../../../core/store/flow-detail/flow-detail.interface';
import {FlorderEditContainer} from '../../florders/florder-edit-container/florder-edit.container';

@Component({
  selector: 'app-flow-edit',
  templateUrl: './flow-edit.container.html',
  styleUrls: ['../../florders/florder-edit-container/florder-edit.container.less'],
  animations: [fadeInAnimation],
})
export class FlowEditContainer extends FlorderEditContainer implements OnInit {

  triggerPlanningValidation: EventEmitter<boolean> = new EventEmitter();
  flowDetail: FlorderDetail;

  contractInfo: ContractInfo;
  flowRegistrationTypes: CDFlorderType[];
  flowHandshakeTypes: CDFlorderType[];
  datesRange: {
    startDate: string;
    endDate: string;
  };
  flowDate: CheckFlowDateResponse;
  filterValues: FilterValues;

  constructor(
    injector: Injector,
    private simplePageScrollService: SimplePageScrollService,
    private sandbox: FlowSandbox,
  ) {
    super(injector);

    const contractInfo$ = this.store.takeWhile(() => !this.destroyed).map(state => state.contractInfo).distinctUntilChanged();

    contractInfo$.subscribe(contractInfo => {
      this.flowRegistrationTypes = contractInfo.flowRegistrationTypes;
      this.flowHandshakeTypes = contractInfo.flowHandshakeTypes;
      this.contractInfo = contractInfo;
    });

    this.store.map(state => state.flows.filterValues).takeWhile(() => !this.destroyed).distinctUntilChanged().subscribe(filterValues => this.filterValues = filterValues);

    this.store.select('editFlowDetail')
      .takeWhile(() => !this.destroyed)
      .filter((editFlowDetail: EditFlowDetail) => !!editFlowDetail.flowDetail)
      .subscribe((editFlowDetail: EditFlowDetail) => {
        this.datesRange = editFlowDetail.datesRange;
        this.mode = editFlowDetail.mode;
        const materialEdit = !!(editFlowDetail.flowDetail && editFlowDetail.flowDetail.materials && editFlowDetail.mode.material);
        const materialExists = materialEdit && editFlowDetail.flowDetail.materials.find(m => m.internalId === editFlowDetail.mode.material.internalId) != null;
        this.flowDetail = editFlowDetail.flowDetail;
        this.panelStatus = this.getFlowPanelStatusses(materialEdit, materialExists, this.flowDetail);

        contractInfo$.filter(contractInfo => contractInfo.flowRegistrationTypes != null || contractInfo.flowHandshakeTypes != null).take(1).subscribe(contractDetails => {
          if (this.flowDetail.etmOrderNumber) {

            this.to = this.findTo(this.flowRegistrationTypes, this.flowDetail);
            if (!this.to) {
              this.to = this.findTo(this.flowHandshakeTypes, this.flowDetail);
            }
            this.incoterm = this.to && this.to.incoterms[0];
          } else {
            const flowType = this.flowRegistrationTypes.find(flowType => flowType.id === this.flowDetail.deliveryMethod.type);
            const from = flowType && this.flowDetail.deliveryMethod.from && flowType.shippingConditions.length && flowType.shippingConditions[0].froms.find(from => from.id === this.flowDetail.deliveryMethod.from.id);
            this.to = from && this.flowDetail.deliveryMethod.to && from.tos.find(to => to.id === this.flowDetail.deliveryMethod.to.id);
            this.incoterm = this.to && this.to.incoterms[0];
          }
        });
        this.flowDate = editFlowDetail.flowDate && editFlowDetail.flowDate.CheckFlowDateResponse;
      });

    this.store.select('editFlowDetail').takeWhile(() => !this.destroyed).map((editFlowDetail: EditFlowDetail) => editFlowDetail).distinctUntilChanged().filter(val => val.mode.saved).subscribe(value => {
      this.openCreateFeedbackDialog({
        success: value.mode.saveSuccess,
        etmOrderNumber: value.flowDetail.etmOrderNumber,
        salesOrderNumber: value.flowDetail.salesOrderNumber
      });
    });
  }

  private findTo(florderTypes: CDFlorderType[], flow: FlorderDetail): CDTo {
    const flowType: CDFlorderType = florderTypes.find(flowType => flowType.id === flow.deliveryMethod.type);
    const from = flowType && flowType.shippingConditions.length && flowType.shippingConditions[0].froms.find(from => from.id === flow.deliveryMethod.from.id);
    return from && from.tos.find(to => to.id === flow.deliveryMethod.to.id);
  }

  private getFlowPanelStatusses(materialEdit: boolean, materialExists: boolean, flow: FlorderDetail) {
    const flowEdits = {
      isFlowEdit: this.mode.state === 'edit'
    };
    const panelStatusses = this.getPanelStatusses(materialEdit, materialExists);
    const inCreateMode = (this.mode.state === 'create' || this.mode.state === 'create-confirm');
    const inEditMode = (this.mode.state === 'edit' || this.mode.state === 'edit-confirm') && this.flowDetail.registrar && !this.flowDetail.lateHandshake;
    const inHandshakeMode = (this.mode.state === 'edit' || this.mode.state === 'edit-confirm') && this.flowDetail.handshaker && !this.flowDetail.lateHandshake;
    const inLateHandshakeMode = (this.mode.state === 'edit' || this.mode.state === 'edit-confirm') && this.flowDetail.registrar && this.flowDetail.lateHandshake;

    return {
      ...panelStatusses,
      delivery: {
        ...panelStatusses.delivery,
        ...flowEdits,
        isEdit: panelStatusses.delivery.isEdit && (inEditMode || inHandshakeMode || inCreateMode),
        isEditable: panelStatusses.delivery.isEditable && (inCreateMode || inEditMode || inHandshakeMode)
      },
      detail: {
        ...panelStatusses.detail,
        isEditable: panelStatusses.detail.isEditable && (inCreateMode || inEditMode || inHandshakeMode),
        // isEditable: panelStatusses.detail.isEditable && ((this.mode.state !== 'edit' && this.mode.state !== 'edit-confirm') ||
        // (this.flowDetail && ((this.flowDetail.registrar && !this.flowDetail.lateHandshake) || this.flowDetail.handshaker))),
        ...flowEdits,
      },
      material: {
        ...panelStatusses.material,
        isHandshaker: this.flowDetail.handshaker,
        ...flowEdits,
      },
      planning: {
        ...panelStatusses.planning,
        isEditable: panelStatusses.planning.isEditable && (inCreateMode || inEditMode || inHandshakeMode),
        ...flowEdits,
      },
    };
  }

  ngOnInit(): void {
    this.simplePageScrollService.scrollToElement('#top', 0);
  }

  canEdit(): boolean {
    return this.mode && this.mode.state === 'view' && this.authorization && this.authorization.FLOW.UPDATE && this.flowDetail && !this.flowDetail.isLocked && this.flowDetail.status === AppSettings.FLOW_STATUS_WAITING_FOR_HANDSHAKE && !this.flowDetail.handshaker && !this.flowDetail.lateHandshake;
  }

  canHandshake(): boolean {
    return this.mode && this.mode.state === 'view' && this.authorization && this.authorization.FLOW.UPDATE && this.flowDetail && !this.flowDetail.isLocked && this.flowDetail.status === AppSettings.FLOW_STATUS_WAITING_FOR_HANDSHAKE && (this.flowDetail.handshaker || this.flowDetail.lateHandshake);
  }

  editFlow() {
    return this.store.dispatch(go([`/flows/${this.flowDetail.etmOrderNumber}/edit`]));
  }

  handshakeFlow() {
    return this.store.dispatch(go([`/flows/${this.flowDetail.etmOrderNumber}/edit`]));
  }

  editDeliveryMethodClicked() {
    this.store.dispatch(new actions.FlowDetailEditDeliveryMethod());
  }

  editDetailClicked() {
    this.store.dispatch(new actions.FlowDetailCreateEditFlowDetail());
  }

  editPlanningClicked() {
    this.store.dispatch(new actions.FlowDetailCreateEditFlowPlanning());
  }

  setDeliveryMethod(form): void {
    const orderTypeId = form.type;
    const fromId = form.from.id;
    const toId = form.to.id;
    this.sandbox.loadContractInfoMaterials({orderTypeId, fromId, toId}, !this.flowDetail.handshaker).subscribe(() => {
      this.route.queryParams.take(1).subscribe(params => {
        this.store.dispatch(new actions.FlowDetailCreateSetDeliveryMethod(form));
        this.triggerPlanningValidation.emit(true);
      });
    }, error => {
      this.sandbox.showWarning('ERRORS.CONTRACT-INFO.TITLE', 'ERRORS.CONTRACT-INFO.INVALID_CONTRACT_PART_1');
    });
  }

  removeMaterial(material): void {
    this.store.dispatch(new actions.FlowDetailCreateRemoveMaterial(material));
  }

  editMaterial(material) {
    this.store.dispatch(new actions.FlowDetailCreateStartEditMaterial(material));
  }

  getMaterials(): Material[] {
    return this.flowDetail.materials;
  }

  saveMaterial(material) {
    if (this.checkMaterialIsUnique(material)) {
      this.store.dispatch(new actions.FlowDetailCreateSaveMaterial(material));
    }
  }

  create(data) { // Can also be an update
    this.store.dispatch(new actions.FlowDetailCreateOrUpdateSubmit(data));
  }

  downloadDocument(etmOrderNumber: string, extension: string): void {
    this.store.dispatch(new actions.FlowDetailDocumentDownloadAction({etmOrderNumber, extension}));
  }

  backToDeliveryClicked() {
    this.store.dispatch(new actions.FlowDetailGoBackToDelivery('flow'));
  }

  backToDetailClicked() {
    this.store.dispatch(new actions.FlowDetailGoBackToDetail('flow'));
  }

  saveDetails() {
    this.store.dispatch(new actions.FlowDetailSaveFlowDetail());
  }

  savePlanning(form) {
    this.store.dispatch(new actions.FlowDetailSavePlanning(form));
  }

  resetMaterialsAndPlanning() {
    this.store.dispatch(new actions.FlowDetailResetMaterialsAndPlanning());
  }

  submitClicked() {
    if (this.mode.state === 'edit-confirm' && (this.flowDetail.handshaker || this.flowDetail.lateHandshake)) {
      this.store.dispatch(new actions.FlowAcceptFlowStartAction());
    } else {
      this.create({});
    }
  }

  protected openCreateFeedbackDialog({success, etmOrderNumber, salesOrderNumber}): void {
    let messageType = '';
    if (this.flowDetail.handshaker || this.flowDetail.lateHandshake) {
      messageType = 'HANDSHAKE_';
    }
    super.openCreateFeedbackDialog({
      success,
      etmOrderNumber,
      salesOrderNumber,
      messageType,
      incoterm: null,
      ccrNumber: null,
      showDownloadDocumentButton: true,
      showCreateButton: true,
      moduleRoute: 'flows',
      createAction: new actions.FlowDetailCreateStart(),
    });
  }

  loadContractInfoFromFlowTypeToIncoterm(flowTypeId: string) {
    this.sandbox.loadContractInfoFromFlowTypeToIncoterm(flowTypeId, !this.flowDetail.handshaker);
  }
}
