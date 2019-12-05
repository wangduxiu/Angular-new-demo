import {Component, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SimplePageScrollService} from 'ng2-simple-page-scroll';
import {fadeInAnimation} from '../../../animations';
import {ValidatorService} from '../../../core/services/validator.service';
import * as ccrActions from '../../../core/store/ccr-detail/ccr-detail.actions';
import {CCREditMaterialLine} from '../../../core/store/ccr-detail/ccr-detail.interface';
import {CDFlorderType, CDIncoterm, CDTo, ContractRestrictions} from '../../../core/store/contract-details/contract-details.interface';
import {FlorderDetail} from '../../../core/store/florder-detail/florder-detail.interface';
import * as orderActions from '../../../core/store/order-detail/order-detail.actions';
import {EditOrderDetail} from '../../../core/store/order-detail/order-detail.interface';
import {FlorderEditContainer} from '../../florders/florder-edit-container/florder-edit.container';

@Component({
  selector: 'app-ccr-edit',
  templateUrl: './ccr-edit.container.html',
  styleUrls: ['../../florders/florder-edit-container/florder-edit.container.less'],
  animations: [fadeInAnimation],
})
export class CCREditContainer extends FlorderEditContainer implements OnInit {

  orderDetail: FlorderDetail;
  restrictions: ContractRestrictions;

  availablePickingDates: {
    full: string[];
    nonFull: string[];
  };

  orderTypes: CDFlorderType[];

  ccrForm: FormGroup;

  constructor(injector: Injector, private formBuilder: FormBuilder, private validatorService: ValidatorService, private simplePageScrollService: SimplePageScrollService) {
    super(injector);

    this.store.select('editCCRDetail').takeWhile(() => !this.destroyed).map((editCCRDetail: EditOrderDetail) => editCCRDetail).distinctUntilChanged().filter(val => val.mode.saved).subscribe(value => {
      this.openCreateFeedbackDialog({
        success: value.mode.saveSuccess,
        etmOrderNumber: value.orderDetail.etmOrderNumber,
        salesOrderNumber: value.orderDetail.salesOrderNumber,
        ccrNumber: value.orderDetail.ccr.ccrNumber
      });
    });

    const orderTypes$ = this.store.takeWhile(() => !this.destroyed).map(state => state.contractInfo.orderTypes).distinctUntilChanged();
    orderTypes$.subscribe(orderTypes => this.orderTypes = orderTypes);

    this.store.select('editCCRDetail').takeWhile(() => !this.destroyed).subscribe((editOrderDetail: EditOrderDetail) => {
      this.availablePickingDates = editOrderDetail.availablePickingDates;
      this.mode = editOrderDetail.mode;
      const materialEdit = !!(editOrderDetail.orderDetail && editOrderDetail.orderDetail.materials && editOrderDetail.mode.material);
      const materialExists = materialEdit && editOrderDetail.orderDetail.materials.find(m => m.internalId === editOrderDetail.mode.material.internalId) != null;
      this.panelStatus = this.getPanelStatusses(materialEdit, materialExists);
      this.orderDetail = editOrderDetail.orderDetail;

      orderTypes$.filter(orderTypes => orderTypes != null).take(1).subscribe(orderTypes => {
        this.orderTypes = orderTypes;
        let orderType = this.orderTypes && this.orderTypes.find(ot => ot.id === this.orderDetail.deliveryMethod.type);
        let shippingCondition = orderType && this.orderDetail.deliveryMethod.shippingCondition && orderType.shippingConditions.find(sc => sc.id === this.orderDetail.deliveryMethod.shippingCondition.id);

        let from;
        if (shippingCondition.id === 'Z1' && orderType.id === 'EPS-CUS') {
          // from = all
          from = shippingCondition && shippingCondition.froms.find(from => from.id === 'all');
        } else {
          from = shippingCondition && shippingCondition.froms.find(from => from.id === this.orderDetail.deliveryMethod.from.id);
        }
        const froms = shippingCondition && (this.orderDetail.deliveryMethod.from == null ? shippingCondition.froms : from ? [from] : []);

        let to;
        if (shippingCondition.id === 'Z1' && orderType.id === 'CUS-EPS') {
          // to = all
          to = froms && this.orderDetail.deliveryMethod.to && (froms.reduce((to: CDTo, from) => to || (from && from.tos.find(to => to.id === 'all')), null));
        } else {
          to = froms && this.orderDetail.deliveryMethod.to && (froms.reduce((to: CDTo, from) => to || (from && from.tos.find(to => to.id === this.orderDetail.deliveryMethod.to.id)), null));
        }
        let tos = froms && this.orderDetail.deliveryMethod.to == null ? from.tos : to ? [to] : [];

        if (this.orderDetail.deliveryMethod.incoterm) {
          this.incoterm = tos && tos.reduce((incoterm: CDIncoterm, to) => incoterm || (to && to.incoterms.find(it => it.id === this.orderDetail.deliveryMethod.incoterm.id)), null);
        } else {
          this.incoterm = tos && tos.reduce((incoterm: CDIncoterm, to) => incoterm || (to && to.incoterms.length > 0 && to.incoterms[0]), null);
        }
      });
    });

    this.store.takeWhile(() => !this.destroyed).map(state => state.customerInfo).distinctUntilChanged().subscribe(customerInfo => {
      this.restrictions = customerInfo.restrictions;
    });

  }

  ngOnInit(): void {
    this.createForm();
    this.simplePageScrollService.scrollToElement('#top', 0);
  }

  createForm() {
    this.ccrForm = this.formBuilder.group({
      from: [this.orderDetail.deliveryMethod.from],
      to: [this.orderDetail.deliveryMethod.to, [Validators.required]],
      type: [this.orderDetail.deliveryMethod.type],
      soldTo: [this.orderDetail.deliveryMethod.soldTo],
      shippingCondition: [this.orderDetail.deliveryMethod.shippingCondition, [Validators.required]],
      customerReferenceNumber: [this.orderDetail.deliveryMethod.customerReferenceNumber],
      transporter: [this.orderDetail.deliveryMethod.transporter],
      licensePlate: [this.orderDetail.deliveryMethod.licensePlate],
      remarks: [this.orderDetail.deliveryMethod.remarks],
      sealNumber: [this.orderDetail.ccr.sealNumber, this.restrictions.sealNumberRequired ? [Validators.required] : []],
      orderDate: [this.orderDetail.planning.orderDate],
      loadingDate: [this.orderDetail.planning.loadingDate, [Validators.required, this.validatorService.datePatternValidator]],
      exchangePallets: [this.orderDetail.planning.exchangePallets],
      numberOfExchangePallets: [this.orderDetail.planning.numberOfExchangePallets],
    });

    // Issue Kenny 02/04/2019: can't fill in receiver ref nr, so can't submit CCR.
/*
    const getPoNumberRequiredDummyControl = () => {
      const orderType = this.orderTypes.find(type => type.id === this.orderDetail.deliveryMethod.type);
      const shippingCondition = orderType && orderType.shippingConditions.find(shippingCondition => shippingCondition.id === this.orderDetail.deliveryMethod.shippingCondition.id);
      const from = shippingCondition && shippingCondition.froms.find(from => from.id === this.orderDetail.deliveryMethod.from.id);
      const to = from && from.tos.find(to => to.id === this.orderDetail.deliveryMethod.to.id);

      const poNumberValidationInfo = to && to.poNumber || {
        required: false,
        unique: false,
        mask: null,
        example: null,
        fromId: null,
        toId: null,
        etmOrderNumber: null,
        senderRefNumber: null
      };
      const toControl = this.ccrForm.get('to');
      return {
        value: poNumberValidationInfo.required, // Value to evaluate whether or not to add required validator to control
        valueChanges: {
          subscribe: toControl.valueChanges.subscribe.bind(toControl.valueChanges) // re-evaluate condition when TO changed
        }
      };
    };
    util.conditionalValidation(this.ccrForm, 'customerReferenceNumber', [util.createCondition(getPoNumberRequiredDummyControl)], [Validators.required]);
*/
  }

  protected getPanelStatusses(materialEdit: boolean, materialExists: boolean) {
    const panelStatusses = super.getPanelStatusses(materialEdit, materialExists);
    panelStatusses.ccr.isEdit = true;
    return panelStatusses;
  }

  editDeliveryMethodClicked() {
    this.store.dispatch(new orderActions.OrderDetailEditDeliveryMethod());
  }

  editDetailClicked() {
    this.store.dispatch(new orderActions.OrderDetailCreateEditOrderDetail());
  }

  editPlanningClicked(): void {
    this.store.dispatch(new orderActions.OrderDetailCreateEditOrderPlanning());
  }

  setDeliveryMethod(form): void {
    this.store.dispatch(new orderActions.OrderDetailCreateSetDeliveryMethod({deliveryMethod: form, loadingDate: null}));
  }

  removeMaterial(material): void {
    this.store.dispatch(new ccrActions.CCRDetailCreateRemoveMaterial(material));
  }

  editMaterial(material) {
    this.store.dispatch(new ccrActions.CCRDetailCreateStartEditMaterial(material));
  }

  saveMaterial(material) {
    if (this.checkMaterialIsUnique(material)) {
      this.store.dispatch(new ccrActions.CCRDetailCreateSaveMaterial(material));
    }
  }

  getMaterials(): CCREditMaterialLine[] {
    return this.orderDetail.ccr.ccrLineItems;
  }

  create() {
    const newCCR = Object.assign({}, this.orderDetail, {
      sealNumber: this.ccrForm.value.sealNumber,
    });
    this.store.dispatch(new ccrActions.CCRDetailCreateSubmit(newCCR));
  }

  backToDeliveryClicked() {
    this.store.dispatch(new orderActions.OrderDetailGoBackToDelivery('order'));
  }

  backToDetailClicked() {
    this.store.dispatch(new orderActions.OrderDetailGoBackToDetail('order'));
  }

  saveDetails() {
    throw 'Save details not applicable for CCR';
  }

  savePlanning(form) {
    throw 'Save planning not applicable for CCR';
  }

  submitClicked() {
    this.create();
  }

  submitClickedFn() {
    if (this.ccrForm.valid && !this.mode.saving) {
      this.submitClicked();
    }
  }

  getAvailablePickingDates(): string[] {
    return this.orderDetail.fullTruck ? this.availablePickingDates.full : this.availablePickingDates.nonFull;
  }

  protected openCreateFeedbackDialog({success, etmOrderNumber, ccrNumber, salesOrderNumber}): void {
    super.openCreateFeedbackDialog({
      success,
      etmOrderNumber,
      salesOrderNumber,
      ccrNumber,
      messageType: '',
      incoterm: null,
      showDownloadDocumentButton: true,
      moduleRoute: 'orders',
      showCreateButton: false,
      createAction: null,
    });
  }

  downloadDocument(documentId: string, extension: string): void {
    this.store.dispatch(new orderActions.OrderDetailCCRDocumentAction({documentId, extension}));
  }
}
