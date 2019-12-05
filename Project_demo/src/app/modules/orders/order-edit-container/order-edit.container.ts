import { Component, Injector, OnInit } from '@angular/core';
import { MdDialogConfig } from '@angular/material';
import { go } from '@ngrx/router-store';
import { OrderSandbox } from 'app/core/sandboxes/order.sandbox';
import { RecurrenceService } from 'app/core/services/recurrence.service';
import { ContractInfo } from 'app/core/store/contract-info/contract-info.interface';
import { FilterValues } from 'app/core/store/florders/filtervalues.interface';
import { SimplePageScrollService } from 'ng2-simple-page-scroll';
import { Observable } from 'rxjs/Observable';
import { fadeInAnimation } from '../../../animations';
import { CDIncoterm, CDOpeningHours, CDTo, ContractRestrictions } from '../../../core/store/contract-details/contract-details.interface';
import { EmailActors, EmailActorsItem, SimplifiedEmailActor } from '../../../core/store/email-actors/email-actors.interface';
import { FlorderDetail, Material } from '../../../core/store/florder-detail/florder-detail.interface';
import * as orderActions from '../../../core/store/order-detail/order-detail.actions';
import { EditOrderDetail } from '../../../core/store/order-detail/order-detail.interface';
import * as templateActions from '../../../core/store/template/template.actions';
import { TemplateState } from '../../../core/store/template/template.interface';
import { util } from '../../../core/util/util';
import { SelectEmailAddressesModalComponent } from '../../../shared/modal/modal-select-email-addresses.component';
import { FlorderEditContainer } from '../../florders/florder-edit-container/florder-edit.container';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.container.html',
  styleUrls: ['../../florders/florder-edit-container/florder-edit.container.less'],
  animations: [fadeInAnimation],
})
export class OrderEditContainer extends FlorderEditContainer implements OnInit {
  orderDetail: FlorderDetail;
  loadedEpp: number;
  maxEpp: number;
  restrictions: ContractRestrictions;
  templateState: TemplateState;
  emailAddresses: EmailActorsItem[];
  contractInfo: ContractInfo;
  availablePickingDates: {
    full: string[];
    nonFull: string[];
  };
  private loadingDates: string[];
  filterValues: FilterValues;

  constructor(
    injector: Injector,
    private simplePageScrollService: SimplePageScrollService,
    private recurrenceService: RecurrenceService,
    public sandbox: OrderSandbox,
  ) {
    super(injector);

    // Contract
    const contractInfo$ = this.store.map(state => state.contractInfo).takeWhile(() => !this.destroyed).distinctUntilChanged();

    this.store.select('editOrderDetail').takeWhile(() => !this.destroyed).map((editOrderDetail: EditOrderDetail) => editOrderDetail).distinctUntilChanged().filter(val => val.mode.saved).subscribe(value => {
      if (!value.recurrenceDates || value.recurrenceDates.length === 1) {
        this.openCreateFeedbackDialog({
          success: value.mode.saveSuccess,
          etmOrderNumber: value.orderDetail.etmOrderNumber,
          salesOrderNumber: value.orderDetail.salesOrderNumber,
          incoterm: value.orderDetail.deliveryMethod.incoterm && value.orderDetail.deliveryMethod.incoterm.id,
        });
      }
    });

    this.store.select('template').takeWhile(() => !this.destroyed).subscribe((templateState: TemplateState) => this.templateState = templateState);

    this.store.map(state => state.orders.filterValues).takeWhile(() => !this.destroyed).distinctUntilChanged().subscribe(filterValues => this.filterValues = filterValues);

    this.store.map(state => state.editOrderDetail)
      .combineLatest(contractInfo$, (editOrderDetail, contractInfo) => {
        return {
          contractInfo,
          editOrderDetail,
        };
      })
      .takeWhile(() => !this.destroyed)
      .filter(({ editOrderDetail, contractInfo }) => !!editOrderDetail.orderDetail && !contractInfo.loading)
      .distinctUntilChanged()
      .subscribe(({ editOrderDetail, contractInfo }) => {
        this.loadedEpp = editOrderDetail.loadedEpp;
        this.maxEpp = editOrderDetail.maxEpp;
        this.availablePickingDates = editOrderDetail.availablePickingDates;
        this.mode = editOrderDetail.mode;
        const materialEdit = !!(editOrderDetail.orderDetail && editOrderDetail.orderDetail.materials && editOrderDetail.mode.material);
        const materialExists = materialEdit && editOrderDetail.orderDetail.materials.find(m => m.internalId === editOrderDetail.mode.material.internalId) != null;
        this.panelStatus = this.getPanelStatusses(materialEdit, materialExists);
        this.orderDetail = editOrderDetail.orderDetail;

        this.contractInfo = util.jsonDeepCopy(contractInfo); // must be modifiable
        let orderType = this.contractInfo.orderTypes.find(o => o.id === this.orderDetail.deliveryMethod.type);
        let shippingCondition = orderType && this.orderDetail.deliveryMethod.shippingCondition && orderType.shippingConditions.find(sc => sc.id === this.orderDetail.deliveryMethod.shippingCondition.id);
        const from = shippingCondition && shippingCondition.froms.find(from => from.id === this.orderDetail.deliveryMethod.from.id);
        const froms = shippingCondition && (this.orderDetail.deliveryMethod.from == null ? shippingCondition.froms : from ? [from] : []);
        const to = froms && this.orderDetail.deliveryMethod.to && (froms.reduce((to: CDTo, from) => to || (from && from.tos.find(to => to.id === this.orderDetail.deliveryMethod.to.id)), null));
        const tos = froms && this.orderDetail.deliveryMethod.to == null ? from.tos : to ? [to] : []; // if to selected, tos contains only selected to
        if (this.orderDetail.deliveryMethod.incoterm) {
          this.incoterm = tos && tos.reduce((incoterm: CDIncoterm, to) => incoterm || (to && to.incoterms.find(it => it.id === this.orderDetail.deliveryMethod.incoterm.id)), null);
        } else {
          this.incoterm = tos && tos.reduce((incoterm: CDIncoterm, to) => incoterm || (to && to.incoterms.length > 0 && to.incoterms[0]), null);
        }

        // If view mode and contract doesn't contain orderType, from or to, add it to enable readonly-view
        if (this.mode.state === 'view' && this.orderDetail.deliveryMethod.from !== null && this.orderDetail.deliveryMethod.to !== null) {
          if (!orderType) {
            orderType = {
              id: this.orderDetail.deliveryMethod.type,
              shippingConditions: [
                {
                  id: '', // TODO test this
                  name: '',
                  froms: [],
                },
              ],
            };
            this.contractInfo.orderTypes.push(orderType);
          }
          if (shippingCondition == null) {
            shippingCondition = {
              id: this.orderDetail.deliveryMethod.shippingCondition.id,
              name: this.orderDetail.deliveryMethod.shippingCondition.name,
              froms: [],
            };
            orderType.shippingConditions.push(shippingCondition);
          }
          orderType.shippingConditions.reverse();
          if (!froms || froms.length === 0) {
            shippingCondition.froms.push({
              id: this.orderDetail.deliveryMethod.from.id,
              isDefault: false,
              hidden: false,
              openingHours: [],
              tos: [],
            });
          }
          shippingCondition = orderType.shippingConditions.find(sc => sc.id === this.orderDetail.deliveryMethod.shippingCondition.id);
          const from = shippingCondition.froms.find(f => f.id === this.orderDetail.deliveryMethod.from.id);
          const to = from.tos.find(t => t.id === this.orderDetail.deliveryMethod.to.id);
          const incoterm = to && to.incoterms.find(ic => ic.id === this.orderDetail.deliveryMethod.shippingCondition.id);
          if (!incoterm) {
            this.incoterm = {
              id: '',
              name: '',
              isDefault: true,
              combination: null,
              packings: [],
              pallets: [],
            };
          }
        }

        if (editOrderDetail.mode.state === 'recurrence-dates' && !this.recurrenceService.isOpen() && editOrderDetail.recurrenceDates) {
          this.recurrenceService.openRecurrenceDatesDialog({
            statePath: 'editOrderDetail',
            cb: this.proceed.bind(this),
            openGoParams: (order: FlorderDetail) => [`/orders/${order.etmOrderNumber}`, { salesOrderNumber: order.salesOrderNumber, back: this.backUrl }],
            backToConfirmAction: new orderActions.OrderDetailBackToCreateConfirm(),
            createButtonLabel: 'ORDERS.RECURRENCE.CREATE',
            gotoOverviewUrl: '/orders',
          });
        }
      });

    this.store.takeWhile(() => !this.destroyed).map(state => state.customerInfo).distinctUntilChanged().subscribe(customerInfo => {
      this.restrictions = customerInfo.restrictions;
    });

    this.store.select('emailActors').takeWhile(() => !this.destroyed).subscribe((emailActors: EmailActors) => {
      this.emailAddresses = emailActors.items.filter(it => it.isActive);
    });
  }

  ngOnInit(): void {
    this.simplePageScrollService.scrollToElement('#top', 0);
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
    const orderTypeId = form.type;
    const shippingCondition = form.shippingCondition.id;
    const fromId = form.from.id;
    const toId = form.to.id;
    const incoterm = form.incoterm.id;
    this.sandbox.loadContractInfoMaterials({ orderTypeId, shippingCondition, fromId, toId, incoterm }).subscribe(
      () => {
        this.route.queryParams.take(1).subscribe(params => {
          this.store.dispatch(new orderActions.OrderDetailCreateSetDeliveryMethod({ deliveryMethod: form, loadingDate: params.date }));
        });
      },
      error => {
        this.sandbox.showWarning('ERRORS.CONTRACT-INFO.TITLE', 'ERRORS.CONTRACT-INFO.INVALID_CONTRACT_PART_1');
      });
  }

  removeMaterial(material): void {
    this.store.dispatch(new orderActions.OrderDetailCreateRemoveMaterial(material));
  }

  editMaterial(material) {
    this.store.dispatch(new orderActions.OrderDetailCreateStartEditMaterial(material));
  }

  getMaterials(): Material[] {
    return this.orderDetail.materials;
  }

  resetMaterialsAndPlanning() {
    this.store.dispatch(new orderActions.OrderDetailResetMaterialsAndPlanning());
  }

  saveMaterial(material) {
    if (this.checkMaterialIsUnique(material)) {
      this.store.dispatch(new orderActions.OrderDetailCreateSaveMaterialStart({ material, preventRestCall: false, showPopup: true }));
    }
  }

  create(data) {
    this.proceed();
  }

  submitClicked() {
    this.proceed();
  }

  /**
   * Method to finalize creation of an order or template.  Now dialog windows can appear if needed, or the order / template is created immediately.
   *
   * possible outcomes:
   * - Is a template ==> create template
   * - Is a 'create order' with recurrence on and loadingDate not yet an array ==> open recurrence dialog
   * - Is a 'create order' with recurrence on, with emailAddresses list ==> open recurrence dialog
   * - Is a 'create order' without recurrence but customer has emailAddresses list ==> Open email dialog
   * - Is a 'create order' without recurrence, without emailAddresses list ==> Create order
   */
  proceed(loadingDates?: string[]) {
    this.loadingDates = loadingDates;
    if (this.mode.createTemplate || this.mode.editTemplate) {
      this.store.dispatch(new templateActions.TemplateSaveFromOrderAction({ silentSuccess: false, create: this.mode.createTemplate }));
    } else {
      // Check for recurrence without array of dates
      if (this.orderDetail.planning.recurrence && this.orderDetail.planning.recurrence.active && !this.loadingDates) {
        this.store.dispatch(new orderActions.OrderDetailGetRecurrenceDates(this.orderDetail));
      } else if (this.emailAddresses.length > 0 && this.authorization.useEmailActors) { // Check if user can work with emailActors AND there are emails registered
        this.openEmailDialog();
      } else {
        this.store.dispatch(new orderActions.OrderDetailCreateSubmit({ emailAddresses: [], loadingDates: this.loadingDates }));
      }
    }
  }

  backToDeliveryClicked() {
    this.store.dispatch(new orderActions.OrderDetailGoBackToDelivery('order'));
  }

  backToDetailClicked() {
    this.store.dispatch(new orderActions.OrderDetailGoBackToDetail('order'));
  }

  saveDetails() {
    this.store.dispatch(new orderActions.OrderDetailSaveOrderDetail({}));
  }

  savePlanning(form) {
    this.store.dispatch(new orderActions.OrderDetailSavePlanning(form));
  }

  getAvailablePickingDates(): string[] {
    return this.orderDetail.fullTruck ? this.availablePickingDates.full : this.availablePickingDates.nonFull;
  }

  getOpeningHours(): CDOpeningHours[] {
    const orderType = this.contractInfo.orderTypes && this.contractInfo.orderTypes.find(orderType => orderType.id === this.orderDetail.deliveryMethod.type);
    const shippingCondition = orderType &&
      this.orderDetail.deliveryMethod &&
      this.orderDetail.deliveryMethod.shippingCondition &&
      orderType.shippingConditions.find(sc => sc.id === this.orderDetail.deliveryMethod.shippingCondition.id);
    const from = shippingCondition && this.orderDetail.deliveryMethod.from && shippingCondition.froms.find(from => from.id === this.orderDetail.deliveryMethod.from.id);
    const to = from && this.orderDetail.deliveryMethod.to && from.tos.find(to => to.id === this.orderDetail.deliveryMethod.to.id);
    const transportByEps = this.orderDetail.deliveryMethod &&
      this.orderDetail.deliveryMethod.shippingCondition &&
      this.orderDetail.deliveryMethod.shippingCondition.id === 'Z1';
    const isDelivery = this.orderDetail.deliveryMethod.type === 'EPS-CUS';

    const depot = isDelivery ? from : to;
    const location = isDelivery ? to : from;

    if (transportByEps) {
      return location && location.openingHours;
    } else { // Transport by customer
      return depot && depot.openingHours;
    }

  }

  createCCR(): void {
    this.store.dispatch(go([`/ccr/${this.orderDetail.etmOrderNumber}`, { salesOrderNumber: this.orderDetail.salesOrderNumber }]));
  }

  copyOrder(): void {
    this.sandbox.copyOrder(this.orderDetail.deliveryMethod.soldTo.id, this.orderDetail.etmOrderNumber, this.orderDetail.salesOrderNumber);
  }

  get disableButtons(): boolean {
    return this.templateState && this.templateState.saving || this.mode && (this.mode.saving || this.mode.state === 'recurrence-dates');
  }

  downloadDocument(etmOrderNumber: string, extension: string): void {
    throw new Error('Not possible to download THE order document.  Not a feature that is supported.  Only for flows');
  }

  downloadDocumentFromList({ documentId, extension }): void {
    this.store.dispatch(new orderActions.OrderDetailDocumentDownloadAction({ documentId, extension }));
  }

  openEmailDialog() {
    const modalData = { emailAddresses: this.emailAddresses, loadingDates: this.loadingDates };
    const config: MdDialogConfig = {
      width: '50%', height: 'auto', data: modalData, role: 'dialog',
    };
    this.dialog
      .open(SelectEmailAddressesModalComponent, config)
      .afterClosed().subscribe(result => {
        const selectedEmailAddresses: SimplifiedEmailActor[] = this.emailAddresses.filter(actor => {
        if (result.emailAddresses && actor.id === result.emailAddresses.find(emailAddress => emailAddress === actor.id)) {
          return actor;
        }
      }).map((emailActor: EmailActorsItem) => {
        return {
          email: emailActor.email,
          name: emailActor.name,
        };
      });
        if (result && result.isSubmit) {
          this.store.dispatch(new orderActions.OrderDetailCreateSubmit({ emailAddresses: selectedEmailAddresses, loadingDates: this.loadingDates }));
        } else {
          this.store.dispatch(new orderActions.OrderDetailBackToCreateConfirm());
          this.loadingDates = null;
          this.recurrenceService.closeRecurrenceDatesDialog();
        }
      });

    return Observable.of(modalData);

  }

  protected openCreateFeedbackDialog({ success, etmOrderNumber, salesOrderNumber, incoterm }): void {
    super.openCreateFeedbackDialog({
      success,
      etmOrderNumber,
      salesOrderNumber,
      incoterm,
      ccrNumber: null,
      messageType: '',
      showDownloadDocumentButton: false,
      showCreateButton: true,
      moduleRoute: 'orders',
      createAction: new orderActions.OrderDetailCreateStart({
        activeCustomer: this.orderDetail.deliveryMethod.soldTo,
        date: null,
        restrictions: this.restrictions,
        preventCheckingContractDetails: false,
      }),
    });
  }

  loadContractInfoFromOrderTypeToIncoterm(orderTypeId: string) {
    this.sandbox.loadContractInfoFromOrderTypeToIncoterm(orderTypeId);
  }

  loadContractInfoFromOrderTypeToFrom(form) {
    // this.sandbox.loadContractInfoFromFromToIncoterm(this.orderDetail.deliveryMethod.soldTo.id, 'ORDER', this.form);
  }
}
